/**
 * FTGO API Client
 * Type-safe HTTP client with Valibot validation
 */

import * as v from "valibot";
import * as schemas from "./schemas";

export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiClient {
  private config: Required<ApiConfig>;
  private token: string | null = null;

  constructor(config: ApiConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""),
      timeout: config.timeout ?? 10000,
      defaultHeaders: {
        "Content-Type": "application/json",
        ...config.defaultHeaders,
      },
    };
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private createFormData(data: Record<string, any>): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }
    return params.toString();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { schema?: v.BaseSchema<any, any, any> } = {},
    override_token?: string,
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const { schema, ...requestOptions } = options;

    const token = override_token ?? this.token;

    const headers = {
      ...this.config.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...requestOptions,
        headers,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          // Ignore JSON parsing errors for error responses
        }

        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response,
          errorBody,
        );
      }

      const data = await response.json();

      if (schema) {
        return v.parse(schema, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : "Unknown error",
        0,
      );
    }
  }

  // Authentication endpoints
  async issueToken(
    request: schemas.IssueTokenRequest,
  ): Promise<schemas.IssueTokenResponse> {
    return this.request("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.createFormData(request),
      schema: schemas.IssueTokenResponseSchema,
    });
  }

  // User endpoints
  async createUser(
    request: schemas.CreateUserRequest,
  ): Promise<schemas.CreateUserResponse> {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(request),
      schema: schemas.CreateUserResponseSchema,
    });
  }

  async getCurrentUser(
    access_token?: string,
  ): Promise<schemas.UserInfoResponse> {
    return this.request(
      "/me",
      {
        method: "GET",
        schema: schemas.UserInfoResponseSchema,
      },
      access_token,
    );
  }

  // Consumer endpoints
  async createConsumer(
    request: schemas.CreateConsumerRequest,
    access_token?: string,
  ): Promise<schemas.CreateConsumerResponse> {
    return this.request(
      "/consumers",
      {
        method: "POST",
        body: JSON.stringify(request),
        schema: schemas.CreateConsumerResponseSchema,
      },
      access_token,
    );
  }

  async getConsumer(
    id: string,
    access_token?: string,
  ): Promise<schemas.Consumer> {
    return this.request(
      `/consumers/${id}`,
      {
        method: "GET",
        schema: schemas.ConsumerSchema,
      },
      access_token,
    );
  }

  async getAccount(
    consumerId: string,
  ): Promise<schemas.AccountDetailsResponse> {
    return this.request(`/consumers/${consumerId}/account`, {
      method: "GET",
      schema: schemas.AccountDetailsResponseSchema,
    });
  }

  async depositToAccount(
    consumerId: string,
    request: schemas.DepositRequest,
  ): Promise<schemas.DepositResponse> {
    return this.request(`/consumers/${consumerId}/account/deposit`, {
      method: "POST",
      body: JSON.stringify(request),
      schema: schemas.DepositResponseSchema,
    });
  }

  async withdrawFromAccount(
    consumerId: string,
    request: schemas.WithdrawRequest,
  ): Promise<schemas.WithdrawResponse> {
    return this.request(`/consumers/${consumerId}/account/withdraw`, {
      method: "POST",
      body: JSON.stringify(request),
      schema: schemas.WithdrawResponseSchema,
    });
  }

  // Restaurant endpoints
  async createRestaurant(
    request: schemas.CreateRestaurantRequest,
  ): Promise<schemas.CreateRestaurantResponse> {
    return this.request("/restaurants", {
      method: "POST",
      body: JSON.stringify(request),
      schema: schemas.CreateRestaurantResponseSchema,
    });
  }

  async getRestaurant(id: string): Promise<schemas.Restaurant> {
    return this.request(`/restaurants/${id}`, {
      method: "GET",
      schema: schemas.RestaurantSchema,
    });
  }

  async listRestaurants(): Promise<schemas.ListRestaurantsResponse> {
    return this.request("/restaurants", {
      method: "GET",
      schema: schemas.ListRestaurantsResponseSchema,
    });
  }

  // Order endpoints
  async createOrder(
    request: schemas.CreateOrderRequest,
  ): Promise<schemas.CreateOrderResponse> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(request),
      schema: schemas.OrderSchema,
    });
  }

  async getOrder(id: string): Promise<schemas.CreateOrderResponse> {
    return this.request(`/orders/${id}`, {
      method: "GET",
      schema: schemas.OrderSchema,
    });
  }

  async listOrders(
    options: {
      consumer_id?: string;
      restaurant_id?: string;
      state?: string;
      first?: number;
      after?: string;
      last?: number;
      before?: string;
    } = {},
  ): Promise<schemas.ListOrdersResponse> {
    const params = new URLSearchParams();
    if (options.consumer_id) params.set("consumer_id", options.consumer_id);
    if (options.restaurant_id)
      params.set("restaurant_id", options.restaurant_id);
    if (options.state) params.set("state", options.state);
    if (options.first !== undefined)
      params.set("first", options.first.toString());
    if (options.after) params.set("after", options.after);
    if (options.last !== undefined) params.set("last", options.last.toString());
    if (options.before) params.set("before", options.before);

    const query = params.toString();
    const endpoint = `/orders${query ? `?${query}` : ""}`;

    return this.request(endpoint, {
      method: "GET",
      schema: schemas.ListOrdersResponseSchema,
    });
  }

  // Kitchen endpoints
  async listTickets(
    restaurantId: string,
    options: {
      first?: number;
      after?: string;
      last?: number;
      before?: string;
    } = {},
  ): Promise<schemas.ListTicketsResponse> {
    const params = new URLSearchParams();
    if (options.first !== undefined)
      params.set("first", options.first.toString());
    if (options.after) params.set("after", options.after);
    if (options.last !== undefined) params.set("last", options.last.toString());
    if (options.before) params.set("before", options.before);

    const query = params.toString();
    const endpoint = `/restaurants/${restaurantId}/tickets${query ? `?${query}` : ""}`;

    return this.request(endpoint, {
      method: "GET",
      schema: schemas.ListTicketsResponseSchema,
    });
  }

  async getTicket(
    restaurantId: string,
    ticketId: string,
  ): Promise<schemas.KitchenTicket> {
    return this.request(`/restaurants/${restaurantId}/tickets/${ticketId}`, {
      method: "GET",
      schema: schemas.KitchenTicketSchema,
    });
  }

  async acceptTicket(
    restaurantId: string,
    ticketId: string,
  ): Promise<schemas.KitchenTicket> {
    return this.request(
      `/restaurants/${restaurantId}/tickets/${ticketId}/accept`,
      {
        method: "POST",
        schema: schemas.KitchenTicketSchema,
      },
    );
  }

  async preparingTicket(
    restaurantId: string,
    ticketId: string,
  ): Promise<schemas.KitchenTicket> {
    return this.request(
      `/restaurants/${restaurantId}/tickets/${ticketId}/preparing`,
      {
        method: "POST",
        schema: schemas.KitchenTicketSchema,
      },
    );
  }

  async readyForPickupTicket(
    restaurantId: string,
    ticketId: string,
  ): Promise<schemas.KitchenTicket> {
    return this.request(
      `/restaurants/${restaurantId}/tickets/${ticketId}/ready`,
      {
        method: "POST",
        schema: schemas.KitchenTicketSchema,
      },
    );
  }

  // Delivery endpoints
  async createCourier(
    access_token?: string,
  ): Promise<schemas.CreateCourierResponse> {
    return this.request(
      "/couriers",
      {
        method: "POST",
        schema: schemas.CreateCourierResponseSchema,
      },
      access_token,
    );
  }

  async getCourier(courierId: string): Promise<schemas.CourierDetailsResponse> {
    return this.request(`/couriers/${courierId}`, {
      method: "GET",
      schema: schemas.CourierDetailsResponseSchema,
    });
  }

  async updateCourierAvailability(
    courierId: string,
    request: schemas.UpdateCourierAvailabilityRequest,
  ): Promise<void> {
    return this.request(`/couriers/${courierId}/availability`, {
      method: "PUT",
      body: JSON.stringify(request),
    });
  }

  async getCourierPlan(
    courierId: string,
  ): Promise<schemas.CourierPlanResponse> {
    return this.request(`/couriers/${courierId}/plan`, {
      method: "GET",
      schema: schemas.CourierPlanResponseSchema,
    });
  }

  async getDeliveryStatus(
    orderId: string,
  ): Promise<schemas.DeliveryStatusResponse> {
    return this.request(`/orders/${orderId}/delivery`, {
      method: "GET",
      schema: schemas.DeliveryStatusResponseSchema,
    });
  }

  async pickupDelivery(deliveryId: string): Promise<void> {
    return this.request(`/deliveries/${deliveryId}/pickup`, {
      method: "POST",
    });
  }

  async dropoffDelivery(deliveryId: string): Promise<void> {
    return this.request(`/deliveries/${deliveryId}/dropoff`, {
      method: "POST",
    });
  }
}

// Get base URL from environment variable or fallback to localhost
function getBaseUrl(): string {
  // For browser environments
  if (typeof window !== "undefined") {
    return (window as any).__FTGO_API_URL__ || "http://localhost:8100";
  }

  // For Node.js environments
  if (typeof process !== "undefined" && process.env) {
    return process.env.FTGO_API_URL || "http://localhost:8100";
  }

  // Fallback
  return "http://localhost:8100";
}

// Default client instance
export const defaultClient = new ApiClient({
  baseUrl: getBaseUrl(),
});

// Convenience functions using the default client
export const auth = {
  issueToken: (request: schemas.IssueTokenRequest) =>
    defaultClient.issueToken(request),
};

export const users = {
  create: (request: schemas.CreateUserRequest) =>
    defaultClient.createUser(request),
  getCurrentUser: (access_token?: string) =>
    defaultClient.getCurrentUser(access_token),
};

export const consumers = {
  create: (request: schemas.CreateConsumerRequest, access_token?: string) =>
    defaultClient.createConsumer(request, access_token),
  get: (id: string, access_token?: string) =>
    defaultClient.getConsumer(id, access_token),
  getAccount: (consumerId: string) => defaultClient.getAccount(consumerId),
  deposit: (consumerId: string, request: schemas.DepositRequest) =>
    defaultClient.depositToAccount(consumerId, request),
  withdraw: (consumerId: string, request: schemas.WithdrawRequest) =>
    defaultClient.withdrawFromAccount(consumerId, request),
};

export const restaurants = {
  create: (request: schemas.CreateRestaurantRequest) =>
    defaultClient.createRestaurant(request),
  get: (id: string) => defaultClient.getRestaurant(id),
  list: () => defaultClient.listRestaurants(),
};

export const orders = {
  create: (request: schemas.CreateOrderRequest) =>
    defaultClient.createOrder(request),
  get: (id: string) => defaultClient.getOrder(id),
  list: (options?: Parameters<typeof defaultClient.listOrders>[0]) =>
    defaultClient.listOrders(options),
};

export const kitchen = {
  listTickets: (
    restaurantId: string,
    options?: Parameters<typeof defaultClient.listTickets>[1],
  ) => defaultClient.listTickets(restaurantId, options),
  getTicket: (restaurantId: string, ticketId: string) =>
    defaultClient.getTicket(restaurantId, ticketId),
  acceptTicket: (restaurantId: string, ticketId: string) =>
    defaultClient.acceptTicket(restaurantId, ticketId),
  preparingTicket: (restaurantId: string, ticketId: string) =>
    defaultClient.preparingTicket(restaurantId, ticketId),
  readyForPickupTicket: (restaurantId: string, ticketId: string) =>
    defaultClient.readyForPickupTicket(restaurantId, ticketId),
};

export const delivery = {
  createCourier: (access_token?: string) =>
    defaultClient.createCourier(access_token),
  getCourier: (courierId: string) => defaultClient.getCourier(courierId),
  updateCourierAvailability: (
    courierId: string,
    request: schemas.UpdateCourierAvailabilityRequest,
  ) => defaultClient.updateCourierAvailability(courierId, request),
  getCourierPlan: (courierId: string) =>
    defaultClient.getCourierPlan(courierId),
  getStatus: (orderId: string) => defaultClient.getDeliveryStatus(orderId),
  pickup: (deliveryId: string) => defaultClient.pickupDelivery(deliveryId),
  dropoff: (deliveryId: string) => defaultClient.dropoffDelivery(deliveryId),
};

/**
 * Valibot schemas for FTGO API
 * Generated from OpenAPI specification
 */

import * as v from "valibot";

// Common schemas
export const UuidSchema = v.pipe(v.string(), v.uuid());

// Custom date-time schema that handles nanosecond precision
export const DateTimeSchema = v.pipe(
  v.string(),
  v.check((value) => {
    // Try to parse as Date to validate it's a valid timestamp
    const date = new Date(value);
    return !isNaN(date.getTime());
  }, "Invalid date-time format")
);

export const PriceSchema = v.string(); // Price as string for precision

// Error responses
export const ApiErrorResponseSchema = v.object({
  error: v.string(),
});

export type ApiErrorResponse = v.InferOutput<typeof ApiErrorResponseSchema>;

// Authentication schemas
export const IssueTokenRequestSchema = v.object({
  grant_type: v.string(),
  username: v.string(),
  password: v.string(),
});

export const IssueTokenResponseSchema = v.object({
  token_type: v.string(),
  access_token: v.string(),
  expires_in: v.number(),
});

export type IssueTokenRequest = v.InferOutput<typeof IssueTokenRequestSchema>;
export type IssueTokenResponse = v.InferOutput<typeof IssueTokenResponseSchema>;

// User schemas
export const CreateUserRequestSchema = v.object({
  username: v.string(),
  passphrase: v.string(),
});

export const CreateUserResponseSchema = v.object({
  id: UuidSchema,
  username: v.string(),
  created_at: DateTimeSchema,
});

export const UserInfoResponseSchema = v.object({
  id: UuidSchema,
  username: v.string(),
  created_at: DateTimeSchema,
  granted_restaurants: v.array(UuidSchema),
  granted_consumers: v.array(UuidSchema),
  granted_couriers: v.array(UuidSchema),
});

export type CreateUserRequest = v.InferOutput<typeof CreateUserRequestSchema>;
export type CreateUserResponse = v.InferOutput<typeof CreateUserResponseSchema>;
export type UserInfoResponse = v.InferOutput<typeof UserInfoResponseSchema>;

// Consumer schemas
export const CreateConsumerRequestSchema = v.object({
  name: v.string(),
});

export const CreateConsumerResponseSchema = v.object({
  id: UuidSchema,
});

export const ConsumerSchema = v.object({
  id: UuidSchema,
  name: v.string(),
});

export type CreateConsumerRequest = v.InferOutput<typeof CreateConsumerRequestSchema>;
export type CreateConsumerResponse = v.InferOutput<typeof CreateConsumerResponseSchema>;
export type Consumer = v.InferOutput<typeof ConsumerSchema>;

// Account schemas
export const AccountDetailsResponseSchema = v.object({
  account_id: UuidSchema,
  consumer_id: UuidSchema,
  balance: v.string(),
});

export type AccountDetailsResponse = v.InferOutput<typeof AccountDetailsResponseSchema>;

// Restaurant schemas
export const MenuItemRequestSchema = v.object({
  id: v.string(),
  name: v.string(),
  price: PriceSchema,
});

export const MenuItemResponseSchema = v.object({
  id: v.string(),
  name: v.string(),
  price: PriceSchema,
});

export const CreateRestaurantRequestSchema = v.object({
  name: v.string(),
  address: v.string(),
  menu_items: v.array(MenuItemRequestSchema),
});

export const CreateRestaurantResponseSchema = v.object({
  id: UuidSchema,
});

export const RestaurantSchema = v.object({
  id: UuidSchema,
  name: v.string(),
  address: v.string(),
  menu_items: v.array(MenuItemResponseSchema),
});

export const ListRestaurantsResponseSchema = v.object({
  restaurants: v.array(RestaurantSchema),
});

export type MenuItemRequest = v.InferOutput<typeof MenuItemRequestSchema>;
export type MenuItemResponse = v.InferOutput<typeof MenuItemResponseSchema>;
export type CreateRestaurantRequest = v.InferOutput<typeof CreateRestaurantRequestSchema>;
export type CreateRestaurantResponse = v.InferOutput<typeof CreateRestaurantResponseSchema>;
export type Restaurant = v.InferOutput<typeof RestaurantSchema>;
export type ListRestaurantsResponse = v.InferOutput<typeof ListRestaurantsResponseSchema>;

// Order schemas
export const OrderItemRequestSchema = v.object({
  menu_item_id: v.string(),
  quantity: v.number(),
});

export const OrderLineItemSchema = v.object({
  quantity: v.number(),
  menu_item_id: v.string(),
  name: v.string(),
  price: PriceSchema,
});

export const DeliveryInformationSchema = v.object({
  delivery_address: v.string(),
  delivery_time: v.nullable(DateTimeSchema),
});

export const CreateOrderRequestSchema = v.object({
  restaurant_id: UuidSchema,
  consumer_id: UuidSchema,
  items: v.array(OrderItemRequestSchema),
  delivery_address: v.string(),
});

export const CreateOrderResponseSchema = v.object({
  id: UuidSchema,
  state: v.string(),
  consumer_id: UuidSchema,
  restaurant_id: UuidSchema,
  line_items: v.array(OrderLineItemSchema),
  delivery_information: DeliveryInformationSchema,
  order_minimum: PriceSchema,
});

export type OrderItemRequest = v.InferOutput<typeof OrderItemRequestSchema>;
export type OrderLineItem = v.InferOutput<typeof OrderLineItemSchema>;
export type DeliveryInformation = v.InferOutput<typeof DeliveryInformationSchema>;
export type CreateOrderRequest = v.InferOutput<typeof CreateOrderRequestSchema>;
export type CreateOrderResponse = v.InferOutput<typeof CreateOrderResponseSchema>;

// Kitchen schemas
export const TicketLineItemSchema = v.object({
  quantity: v.number(),
  menu_item_id: v.string(),
  name: v.string(),
});

export const KitchenTicketSchema = v.object({
  id: UuidSchema,
  restaurant_id: UuidSchema,
  state: v.string(),
  line_items: v.array(TicketLineItemSchema),
  order_id: v.nullable(UuidSchema),
  accepted_at: v.nullable(DateTimeSchema),
  preparing_at: v.nullable(DateTimeSchema),
  ready_by: v.nullable(DateTimeSchema),
  ready_for_pickup_at: v.nullable(DateTimeSchema),
});

export const ListTicketsResponseSchema = v.object({
  tickets: v.array(KitchenTicketSchema),
});

export type TicketLineItem = v.InferOutput<typeof TicketLineItemSchema>;
export type KitchenTicket = v.InferOutput<typeof KitchenTicketSchema>;
export type ListTicketsResponse = v.InferOutput<typeof ListTicketsResponseSchema>;

// Delivery schemas
export const CourierActionResponseSchema = v.object({
  action_type: v.string(),
  delivery_id: UuidSchema,
  address: v.string(),
  scheduled_time: DateTimeSchema,
});

export const CourierPlanResponseSchema = v.object({
  actions: v.array(CourierActionResponseSchema),
});

export const CourierDetailsResponseSchema = v.object({
  courier_id: UuidSchema,
  available: v.boolean(),
});

export const CreateCourierResponseSchema = v.object({
  courier_id: UuidSchema,
  available: v.boolean(),
});

export const UpdateCourierAvailabilityRequestSchema = v.object({
  available: v.boolean(),
});

export const DeliveryStatusResponseSchema = v.object({
  delivery_id: UuidSchema,
  order_id: UuidSchema,
  state: v.string(),
  courier_actions: v.array(v.string()),
  assigned_courier_id: v.nullable(UuidSchema),
  delivery_time: v.nullable(DateTimeSchema),
  pickup_time: v.nullable(DateTimeSchema),
});

export type CourierActionResponse = v.InferOutput<typeof CourierActionResponseSchema>;
export type CourierPlanResponse = v.InferOutput<typeof CourierPlanResponseSchema>;
export type CourierDetailsResponse = v.InferOutput<typeof CourierDetailsResponseSchema>;
export type CreateCourierResponse = v.InferOutput<typeof CreateCourierResponseSchema>;
export type UpdateCourierAvailabilityRequest = v.InferOutput<typeof UpdateCourierAvailabilityRequestSchema>;
export type DeliveryStatusResponse = v.InferOutput<typeof DeliveryStatusResponseSchema>;
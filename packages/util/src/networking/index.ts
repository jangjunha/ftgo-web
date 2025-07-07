/**
 * FTGO API Networking Package
 * 
 * Provides type-safe HTTP client with Valibot validation for the FTGO API.
 * 
 * @example
 * ```typescript
 * import { defaultClient, auth, restaurants } from '@ftgo/util/networking';
 * 
 * // Authenticate
 * const tokenResponse = await auth.issueToken({
 *   grant_type: 'password',
 *   username: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Set token for authenticated requests
 * defaultClient.setToken(tokenResponse.access_token);
 * 
 * // Make authenticated requests
 * const restaurantList = await restaurants.list();
 * ```
 */

// Export all schemas and types
export * from "./schemas";

// Export client classes and functions
export * from "./client";

// Export utility types
export type ApiResponse<T> = Promise<T>;
export type ApiErrorResponse = import("./schemas").ApiErrorResponse;
/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetConsumer($id: ID!) {\n    consumer(id: $id) {\n      id\n      name\n      account {\n        balance {\n          amount\n        }\n      }\n    }\n  }\n": types.GetConsumerDocument,
    "\n  mutation CreateConsumer($payload: ConsumerInfo!) {\n    createConsumer(c: $payload) {\n        id\n    }\n  }\n": types.CreateConsumerDocument,
    "\n  mutation DepositAccount($accountId: ID!) {\n    depositAccount(accountId: $accountId, amount: { amount: \"5000\" }) {\n      id\n      balance {\n        amount\n      }\n    }\n  }\n": types.DepositAccountDocument,
    "\n  query SelectConsumer($id: ID!) {\n    consumer(id: $id) {\n      id\n      name\n    }\n  }\n": types.SelectConsumerDocument,
    "\n  query SelectRestaurant($id: ID!) {\n    restaurant(id: $id) {\n      id\n      name\n      menuItems {\n        id\n        name\n        price {\n          amount\n        }\n      }\n    }\n  }\n": types.SelectRestaurantDocument,
    "\n  mutation PlaceOrder($order: CreateOrderInput!) {\n    createOrder(o: $order) {\n      id\n    }\n  }\n": types.PlaceOrderDocument,
    "\n  query GetRestaurant($id: ID!) {\n    restaurant(id: $id) {\n      id\n      name\n      menuItems {\n        id\n        name\n        price {\n          amount\n        }\n      }\n    }\n  }\n": types.GetRestaurantDocument,
    "\n  mutation CreateRestaurant($payload: CreateRestaurantInput!) {\n    createRestaurant(r: $payload)\n  }\n": types.CreateRestaurantDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetConsumer($id: ID!) {\n    consumer(id: $id) {\n      id\n      name\n      account {\n        balance {\n          amount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetConsumer($id: ID!) {\n    consumer(id: $id) {\n      id\n      name\n      account {\n        balance {\n          amount\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateConsumer($payload: ConsumerInfo!) {\n    createConsumer(c: $payload) {\n        id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateConsumer($payload: ConsumerInfo!) {\n    createConsumer(c: $payload) {\n        id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation DepositAccount($accountId: ID!) {\n    depositAccount(accountId: $accountId, amount: { amount: \"5000\" }) {\n      id\n      balance {\n        amount\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DepositAccount($accountId: ID!) {\n    depositAccount(accountId: $accountId, amount: { amount: \"5000\" }) {\n      id\n      balance {\n        amount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SelectConsumer($id: ID!) {\n    consumer(id: $id) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query SelectConsumer($id: ID!) {\n    consumer(id: $id) {\n      id\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SelectRestaurant($id: ID!) {\n    restaurant(id: $id) {\n      id\n      name\n      menuItems {\n        id\n        name\n        price {\n          amount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query SelectRestaurant($id: ID!) {\n    restaurant(id: $id) {\n      id\n      name\n      menuItems {\n        id\n        name\n        price {\n          amount\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PlaceOrder($order: CreateOrderInput!) {\n    createOrder(o: $order) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation PlaceOrder($order: CreateOrderInput!) {\n    createOrder(o: $order) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetRestaurant($id: ID!) {\n    restaurant(id: $id) {\n      id\n      name\n      menuItems {\n        id\n        name\n        price {\n          amount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetRestaurant($id: ID!) {\n    restaurant(id: $id) {\n      id\n      name\n      menuItems {\n        id\n        name\n        price {\n          amount\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateRestaurant($payload: CreateRestaurantInput!) {\n    createRestaurant(r: $payload)\n  }\n"): (typeof documents)["\n  mutation CreateRestaurant($payload: CreateRestaurantInput!) {\n    createRestaurant(r: $payload)\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
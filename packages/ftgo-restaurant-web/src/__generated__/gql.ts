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
    "\n  mutation AcceptTicket($id: ID!, $readyBy: DateTimeISO!) {\n    acceptTicket(ticketId: $id, readyBy: $readyBy)\n  }\n": types.AcceptTicketDocument,
    "\n  mutation PreparingTicket($id: ID!) {\n    preparingTicket(ticketId: $id) {\n      id\n      state\n    }\n  }\n": types.PreparingTicketDocument,
    "\n  mutation ReadyForPickupTicket($id: ID!) {\n    readyForPickupTicket(ticketId: $id) {\n      id\n      state\n    }\n  }\n": types.ReadyForPickupTicketDocument,
    "\n  query GetTicket($id: ID!) {\n    ticket(id: $id) {\n      id\n      sequence\n      state\n      lineItems {\n        menuItemId\n        name\n        quantity\n      }\n      readyBy\n    }\n  }\n": types.GetTicketDocument,
    "\n  query ReloadTicket($id: ID!) {\n    ticket(id: $id) {\n      id\n      state\n    }\n  }\n": types.ReloadTicketDocument,
    "\n  query ListTickets($restaurantId: ID!, $after: String, $before: String, $first: Int, $last: Int) {\n    restaurant(id: $restaurantId) {\n      tickets(after: $after, first: $first, before: $before, last: $last) {\n        edges {\n          node {\n            id\n            sequence\n            state\n            lineItems {\n              menuItemId\n              quantity\n              name\n            }\n            readyBy\n          }\n          cursor\n        }\n      }\n    }\n  }\n": types.ListTicketsDocument,
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
export function gql(source: "\n  mutation AcceptTicket($id: ID!, $readyBy: DateTimeISO!) {\n    acceptTicket(ticketId: $id, readyBy: $readyBy)\n  }\n"): (typeof documents)["\n  mutation AcceptTicket($id: ID!, $readyBy: DateTimeISO!) {\n    acceptTicket(ticketId: $id, readyBy: $readyBy)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation PreparingTicket($id: ID!) {\n    preparingTicket(ticketId: $id) {\n      id\n      state\n    }\n  }\n"): (typeof documents)["\n  mutation PreparingTicket($id: ID!) {\n    preparingTicket(ticketId: $id) {\n      id\n      state\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation ReadyForPickupTicket($id: ID!) {\n    readyForPickupTicket(ticketId: $id) {\n      id\n      state\n    }\n  }\n"): (typeof documents)["\n  mutation ReadyForPickupTicket($id: ID!) {\n    readyForPickupTicket(ticketId: $id) {\n      id\n      state\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetTicket($id: ID!) {\n    ticket(id: $id) {\n      id\n      sequence\n      state\n      lineItems {\n        menuItemId\n        name\n        quantity\n      }\n      readyBy\n    }\n  }\n"): (typeof documents)["\n  query GetTicket($id: ID!) {\n    ticket(id: $id) {\n      id\n      sequence\n      state\n      lineItems {\n        menuItemId\n        name\n        quantity\n      }\n      readyBy\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ReloadTicket($id: ID!) {\n    ticket(id: $id) {\n      id\n      state\n    }\n  }\n"): (typeof documents)["\n  query ReloadTicket($id: ID!) {\n    ticket(id: $id) {\n      id\n      state\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ListTickets($restaurantId: ID!, $after: String, $before: String, $first: Int, $last: Int) {\n    restaurant(id: $restaurantId) {\n      tickets(after: $after, first: $first, before: $before, last: $last) {\n        edges {\n          node {\n            id\n            sequence\n            state\n            lineItems {\n              menuItemId\n              quantity\n              name\n            }\n            readyBy\n          }\n          cursor\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ListTickets($restaurantId: ID!, $after: String, $before: String, $first: Int, $last: Int) {\n    restaurant(id: $restaurantId) {\n      tickets(after: $after, first: $first, before: $before, last: $last) {\n        edges {\n          node {\n            id\n            sequence\n            state\n            lineItems {\n              menuItemId\n              quantity\n              name\n            }\n            readyBy\n          }\n          cursor\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
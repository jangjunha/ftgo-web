/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Banking account number is a string of 5 to 17 alphanumeric values for representing an generic account number */
  AccountNumber: { input: any; output: any; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** The `Byte` scalar type represents byte value as a Buffer */
  Byte: { input: any; output: any; }
  /** A country code as defined by ISO 3166-1 alpha-2 */
  CountryCode: { input: any; output: any; }
  /** A field whose value conforms to the standard cuid format as specified in https://github.com/ericelliott/cuid#broken-down */
  Cuid: { input: any; output: any; }
  /** A field whose value is a Currency: https://en.wikipedia.org/wiki/ISO_4217. */
  Currency: { input: any; output: any; }
  /** A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/. */
  DID: { input: any; output: any; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** A field whose value conforms to the standard DeweyDecimal format as specified by the OCLC https://www.oclc.org/content/dam/oclc/dewey/resources/summaries/deweysummaries.pdf */
  DeweyDecimal: { input: any; output: any; }
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  Duration: { input: any; output: any; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: any; output: any; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  GUID: { input: any; output: any; }
  /** A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSL: { input: any; output: any; }
  /** A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSLA: { input: any; output: any; }
  /** A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors. */
  HexColorCode: { input: any; output: any; }
  /** A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal. */
  Hexadecimal: { input: any; output: any; }
  /** A field whose value is an International Bank Account Number (IBAN): https://en.wikipedia.org/wiki/International_Bank_Account_Number. */
  IBAN: { input: any; output: any; }
  /** A field whose value is either an IPv4 or IPv6 address: https://en.wikipedia.org/wiki/IP_address. */
  IP: { input: any; output: any; }
  /** A field whose value is an IPC Class Symbol within the International Patent Classification System: https://www.wipo.int/classifications/ipc/en/ */
  IPCPatent: { input: any; output: any; }
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: { input: any; output: any; }
  /** A field whose value is a IPv6 address: https://en.wikipedia.org/wiki/IPv6. */
  IPv6: { input: any; output: any; }
  /** A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number. */
  ISBN: { input: any; output: any; }
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  ISO8601Duration: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: { input: any; output: any; }
  /** A field whose value conforms to the Library of Congress Subclass Format ttps://www.loc.gov/catdir/cpso/lcco/ */
  LCCSubclass: { input: any; output: any; }
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: { input: any; output: any; }
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  LocalDate: { input: any; output: any; }
  /** A local date-time string (i.e., with no associated timezone) in `YYYY-MM-DDTHH:mm:ss` format, e.g. `2020-01-01T00:00:00`. */
  LocalDateTime: { input: any; output: any; }
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.  This scalar is very similar to the `LocalTime`, with the only difference being that `LocalEndTime` also allows `24:00` as a valid value to indicate midnight of the following day.  This is useful when using the scalar to represent the exclusive upper bound of a time block. */
  LocalEndTime: { input: any; output: any; }
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`. */
  LocalTime: { input: any; output: any; }
  /** The locale in the format of a BCP 47 (RFC 5646) standard string */
  Locale: { input: any; output: any; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: { input: any; output: any; }
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: { input: any; output: any; }
  /** A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address. */
  MAC: { input: any; output: any; }
  /** Floats that will have a value less than 0. */
  NegativeFloat: { input: any; output: any; }
  /** Integers that will have a value less than 0. */
  NegativeInt: { input: any; output: any; }
  /** A string that cannot be passed as an empty value */
  NonEmptyString: { input: any; output: any; }
  /** Floats that will have a value of 0 or more. */
  NonNegativeFloat: { input: any; output: any; }
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: { input: any; output: any; }
  /** Floats that will have a value of 0 or less. */
  NonPositiveFloat: { input: any; output: any; }
  /** Integers that will have a value of 0 or less. */
  NonPositiveInt: { input: any; output: any; }
  /** A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c */
  ObjectID: { input: any; output: any; }
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: { input: any; output: any; }
  /** A field whose value is a valid TCP port within the range of 0 to 65535: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports */
  Port: { input: any; output: any; }
  /** Floats that will have a value greater than 0. */
  PositiveFloat: { input: any; output: any; }
  /** Integers that will have a value greater than 0. */
  PositiveInt: { input: any; output: any; }
  /** A field whose value conforms to the standard postal code formats for United States, United Kingdom, Germany, Canada, France, Italy, Australia, Netherlands, Spain, Denmark, Sweden, Belgium, India, Austria, Portugal, Switzerland or Luxembourg. */
  PostalCode: { input: any; output: any; }
  /** A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGB: { input: any; output: any; }
  /** A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGBA: { input: any; output: any; }
  /** In the US, an ABA routing transit number (`ABA RTN`) is a nine-digit code to identify the financial institution. */
  RoutingNumber: { input: any; output: any; }
  /** The `SafeInt` scalar type represents non-fractional signed whole numeric values that are considered safe as defined by the ECMAScript specification. */
  SafeInt: { input: any; output: any; }
  /** A field whose value is a Semantic Version: https://semver.org */
  SemVer: { input: any; output: any; }
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: { input: any; output: any; }
  /** A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones */
  TimeZone: { input: any; output: any; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any; }
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: { input: any; output: any; }
  /** A currency string, such as $21.25 */
  USCurrency: { input: any; output: any; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: any; output: any; }
  /** Floats that will have a value of 0 or more. */
  UnsignedFloat: { input: any; output: any; }
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: { input: any; output: any; }
  /** A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones */
  UtcOffset: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  balance: Money;
  id: Scalars['ID']['output'];
};

export type Consumer = {
  __typename?: 'Consumer';
  account: Account;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  orders: Array<Order>;
};

export type ConsumerInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Courier = {
  __typename?: 'Courier';
  available: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  plan: CourierPlan;
};

export type CourierAction = {
  __typename?: 'CourierAction';
  address: Scalars['String']['output'];
  delivery: Delivery;
  time: Scalars['DateTimeISO']['output'];
  type: DeliveryAction;
};

export type CourierInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type CourierPlan = {
  __typename?: 'CourierPlan';
  actions: Array<CourierAction>;
};

export type CreateOrderInput = {
  consumerId: Scalars['String']['input'];
  deliveryAddress: Scalars['String']['input'];
  lineItems: Array<MenuItemIdAndQuantity>;
  restaurantId: Scalars['String']['input'];
};

export type CreateRestaurantInput = {
  manager: ManagerInput;
  menuItems: Array<MenuItemInput>;
  name: Scalars['String']['input'];
};

export type Delivery = {
  __typename?: 'Delivery';
  assignedCourier?: Maybe<Courier>;
  courierActions: Array<DeliveryActionInfo>;
  deliveryTime?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  pickupTime?: Maybe<Scalars['DateTimeISO']['output']>;
  state: DeliveryState;
  ticket: Ticket;
};

export enum DeliveryAction {
  Dropoff = 'DROPOFF',
  Pickup = 'PICKUP'
}

export type DeliveryActionInfo = {
  __typename?: 'DeliveryActionInfo';
  type: DeliveryAction;
};

export type DeliveryInfo = {
  __typename?: 'DeliveryInfo';
  assignedCourier?: Maybe<Scalars['String']['output']>;
  estimatedDeliveryTime?: Maybe<Scalars['String']['output']>;
  status: DeliveryStatus;
};

export enum DeliveryState {
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Scheduled = 'SCHEDULED'
}

export enum DeliveryStatus {
  Delivered = 'DELIVERED',
  PickedUp = 'PICKED_UP',
  Preparing = 'PREPARING',
  ReadyForPickup = 'READY_FOR_PICKUP'
}

export type ManagerInput = {
  email: Scalars['EmailAddress']['input'];
  password: Scalars['String']['input'];
};

export type MenuItem = {
  __typename?: 'MenuItem';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Money;
};

export type MenuItemIdAndQuantity = {
  menuItemId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type MenuItemInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  price: MoneyInput;
};

export type Money = {
  __typename?: 'Money';
  amount: Scalars['String']['output'];
};

export type MoneyInput = {
  amount: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptTicket: Scalars['ID']['output'];
  createConsumer: Consumer;
  createCourier: Scalars['ID']['output'];
  createOrder: Order;
  createRestaurant: Scalars['ID']['output'];
  depositAccount: Account;
  dropoffDelivery: Scalars['ID']['output'];
  pickupDelivery: Scalars['ID']['output'];
  preparingTicket: Ticket;
  readyForPickupTicket: Ticket;
  updateCourierAvailability: Courier;
  withdrawAccount: Account;
};


export type MutationAcceptTicketArgs = {
  readyBy: Scalars['DateTimeISO']['input'];
  ticketId: Scalars['ID']['input'];
};


export type MutationCreateConsumerArgs = {
  c: ConsumerInput;
};


export type MutationCreateCourierArgs = {
  c: CourierInput;
};


export type MutationCreateOrderArgs = {
  o: CreateOrderInput;
};


export type MutationCreateRestaurantArgs = {
  r: CreateRestaurantInput;
};


export type MutationDepositAccountArgs = {
  accountId: Scalars['ID']['input'];
  amount: MoneyInput;
};


export type MutationDropoffDeliveryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPickupDeliveryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPreparingTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type MutationReadyForPickupTicketArgs = {
  ticketId: Scalars['ID']['input'];
};


export type MutationUpdateCourierAvailabilityArgs = {
  available: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationWithdrawAccountArgs = {
  accountId: Scalars['ID']['input'];
  amount: MoneyInput;
};

export type Order = {
  __typename?: 'Order';
  consumer?: Maybe<Consumer>;
  deliveryInfo: DeliveryInfo;
  id: Scalars['ID']['output'];
  lineItems: Array<OrderLineItem>;
  restaurant?: Maybe<Restaurant>;
  state: OrderState;
  ticket?: Maybe<Ticket>;
};

export type OrderLineItem = {
  __typename?: 'OrderLineItem';
  menuItemId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Money;
  quantity: Scalars['Int']['output'];
};

export enum OrderState {
  ApprovalPending = 'APPROVAL_PENDING',
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  CancelPending = 'CANCEL_PENDING',
  Rejected = 'REJECTED',
  RevisionPending = 'REVISION_PENDING'
}

export type Query = {
  __typename?: 'Query';
  consumer: Consumer;
  courier: Courier;
  delivery: Delivery;
  order: Order;
  restaurant: Restaurant;
  restaurants: Array<Restaurant>;
  ticket: Ticket;
};


export type QueryConsumerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCourierArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliveryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRestaurantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTicketArgs = {
  id: Scalars['ID']['input'];
};

export type Restaurant = {
  __typename?: 'Restaurant';
  id: Scalars['ID']['output'];
  menuItems: Array<MenuItem>;
  name: Scalars['String']['output'];
  tickets: TicketEdges;
};


export type RestaurantTicketsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type Ticket = {
  __typename?: 'Ticket';
  acceptTime?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  lineItems: Array<TicketLineItem>;
  pickedUpTime?: Maybe<Scalars['DateTimeISO']['output']>;
  preparingTime?: Maybe<Scalars['DateTimeISO']['output']>;
  readyBy?: Maybe<Scalars['DateTimeISO']['output']>;
  readyForPickupTime?: Maybe<Scalars['DateTimeISO']['output']>;
  restaurant: Restaurant;
  sequence?: Maybe<Scalars['Int']['output']>;
  state: TicketState;
};

export type TicketEdge = {
  __typename?: 'TicketEdge';
  cursor: Scalars['String']['output'];
  node: Ticket;
};

export type TicketEdges = {
  __typename?: 'TicketEdges';
  edges: Array<TicketEdge>;
};

export type TicketLineItem = {
  __typename?: 'TicketLineItem';
  menuItemId: Scalars['String']['output'];
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
};

export enum TicketState {
  Accepted = 'ACCEPTED',
  AwaitingAcceptance = 'AWAITING_ACCEPTANCE',
  Cancelled = 'CANCELLED',
  CancelPending = 'CANCEL_PENDING',
  CreatePending = 'CREATE_PENDING',
  PickedUp = 'PICKED_UP',
  Preparing = 'PREPARING',
  ReadyForPickup = 'READY_FOR_PICKUP',
  RevisionPending = 'REVISION_PENDING'
}

export type GetCourierQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCourierQuery = { __typename?: 'Query', courier: { __typename?: 'Courier', id: string, available: boolean, plan: { __typename?: 'CourierPlan', actions: Array<{ __typename?: 'CourierAction', type: DeliveryAction, address: string, time: any, delivery: { __typename?: 'Delivery', id: string, pickupTime?: any | null } }> } } };

export type UpdateCourierAvailabilityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  available: Scalars['Boolean']['input'];
}>;


export type UpdateCourierAvailabilityMutation = { __typename?: 'Mutation', updateCourierAvailability: { __typename?: 'Courier', id: string, available: boolean } };

export type PickupDeliveryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type PickupDeliveryMutation = { __typename?: 'Mutation', pickupDelivery: string };

export type DropoffDeliveryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DropoffDeliveryMutation = { __typename?: 'Mutation', dropoffDelivery: string };


export const GetCourierDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourier"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courier"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"delivery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pickupTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCourierQuery, GetCourierQueryVariables>;
export const UpdateCourierAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCourierAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"available"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCourierAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"available"},"value":{"kind":"Variable","name":{"kind":"Name","value":"available"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"available"}}]}}]}}]} as unknown as DocumentNode<UpdateCourierAvailabilityMutation, UpdateCourierAvailabilityMutationVariables>;
export const PickupDeliveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PickupDelivery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pickupDelivery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<PickupDeliveryMutation, PickupDeliveryMutationVariables>;
export const DropoffDeliveryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DropoffDelivery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dropoffDelivery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DropoffDeliveryMutation, DropoffDeliveryMutationVariables>;
import { gql } from "../__generated__";

const READY_FOR_PICKUP_TICKET = gql(`
  mutation ReadyForPickupTicket($id: ID!) {
    readyForPickupTicket(ticketId: $id) {
      id
      state
    }
  }
`);
export default READY_FOR_PICKUP_TICKET;

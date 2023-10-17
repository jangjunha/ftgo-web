import { gql } from "../__generated__";

const PREPARING_TICKET = gql(`
  mutation PreparingTicket($id: ID!) {
    preparingTicket(ticketId: $id) {
      id
      state
    }
  }
`);
export default PREPARING_TICKET;

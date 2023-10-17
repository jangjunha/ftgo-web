import { gql } from "../__generated__";

const ACCEPT_TICKET = gql(`
  mutation AcceptTicket($id: ID!, $readyBy: DateTimeISO!) {
    acceptTicket(ticketId: $id, readyBy: $readyBy)
  }
`);
export default ACCEPT_TICKET;

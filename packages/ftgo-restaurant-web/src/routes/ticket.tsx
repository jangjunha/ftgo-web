import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { gql } from "../__generated__";
import State from "../components/state";

const GET_TICKET = gql(`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      id
      sequence
      state
      lineItems {
        menuItemId
        name
        quantity
      }
      readyBy
    }
  }
`);

const Ticket = ({ id }: { id: string }): React.ReactElement => {
  const { data, loading } = useQuery(GET_TICKET, { variables: { id } });

  if (loading || data == null) {
    return <>불러오는 중</>;
  }

  const { sequence, state, lineItems, readyBy } = data.ticket;
  return (
    <div className="m-2">
      <p>
        <span className="font-mono bg-black text-white px-2 text-3xl">
          {sequence}
        </span>
      </p>
      <p>
        <State state={state} />
      </p>

      <ul className="bg-neutral-100 flex flex-col gap-y-0.5 py-2">
        {lineItems.map(({ menuItemId, name, quantity }) => (
          <li
            key={menuItemId}
            className="flex justify-between bg-white px-2 py-1"
          >
            <div>{name}</div>
            <div>{quantity}개</div>
          </li>
        ))}
      </ul>

      <div>
        {readyBy && <div>준비 시각: {new Date(readyBy).toLocaleString()}</div>}
      </div>
    </div>
  );
};

const TicketPage = (): React.ReactElement => {
  const { ticketId } = useParams();
  if (ticketId == null) {
    throw new Error();
  }
  return <Ticket id={ticketId} />;
};
export default TicketPage;

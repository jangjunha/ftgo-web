import { useContext } from "react";
import { gql } from "../__generated__";
import restaurantContext from "../context";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { TicketState } from "../__generated__/graphql";
import ACCEPT_TICKET from "../queries/acceptTicket";
import State from "../components/state";
import PREPARING_TICKET from "../queries/preparingTicket";
import READY_FOR_PICKUP_TICKET from "../queries/readyForPickupTicket";

const GET_TICKET = gql(`
  query ReloadTicket($id: ID!) {
    ticket(id: $id) {
      id
      state
    }
  }
`);

const LIST_TICKETS = gql(`
  query ListTickets($restaurantId: ID!, $after: String, $before: String, $first: Int, $last: Int) {
    restaurant(id: $restaurantId) {
      tickets(after: $after, first: $first, before: $before, last: $last) {
        edges {
          node {
            id
            sequence
            state
            lineItems {
              menuItemId
              quantity
              name
            }
            readyBy
          }
          cursor
        }
      }
    }
  }
`);

const LIMIT = 10;

const Tickets = ({
  restaurantId,
}: {
  restaurantId: string;
}): React.ReactElement => {
  const { data, fetchMore } = useQuery(LIST_TICKETS, {
    variables: { restaurantId, first: LIMIT },
  });
  const [getTicket] = useLazyQuery(GET_TICKET);
  const tickets = data?.restaurant.tickets.edges;

  const [acceptTicket] = useMutation(ACCEPT_TICKET);
  const [preparingTicket] = useMutation(PREPARING_TICKET);
  const [readyForPickupTicket] = useMutation(READY_FOR_PICKUP_TICKET);

  const buttonCls = "w-full bg-violet-500 text-white";

  return (
    <div className="bg-neutral-100 pb-16">
      <h3 className="m-2">주문 목록</h3>
      {tickets != null && (
        <div>
          <button
            className={buttonCls}
            onClick={() =>
              fetchMore({
                variables: {
                  restaurantId,
                  before: tickets[0].cursor,
                  last: LIMIT,
                },
              })
            }
          >
            더 불러오기
          </button>
          <ul className="flex flex-col gap-y-0.5 my-0.5">
            {tickets.map(
              ({ node: { id, sequence, state, lineItems, readyBy } }) => (
                <li key={id} className="flex">
                  <Link
                    to={`/tickets/${id}/`}
                    className="flex-1 p-2 flex flex-col bg-white"
                  >
                    <div>
                      <span className="font-mono bg-black text-white px-1">
                        {sequence}
                      </span>
                      <div className="inline ml-2">
                        <State state={state} />
                        {state == TicketState.Accepted && readyBy && (
                          <span className="ml-1">
                            {new Date(readyBy).toLocaleTimeString()} 까지 준비
                          </span>
                        )}
                      </div>
                    </div>
                    <p>{lineItems[0].name}...</p>
                  </Link>
                  <div>
                    {state == TicketState.AwaitingAcceptance && (
                      <button
                        className="bg-fuchsia-500 text-white h-full p-2"
                        onClick={async () => {
                          const minutes = parseInt(
                            prompt("조리 시간 (분)", "15") ?? "",
                          );
                          if (isNaN(minutes)) {
                            return;
                          }
                          const readyBy = new Date();
                          readyBy.setTime(
                            readyBy.getTime() + 1000 * 60 * minutes,
                          );
                          await acceptTicket({
                            variables: { id, readyBy: readyBy.toISOString() },
                          });
                          await getTicket({ variables: { id } });
                        }}
                      >
                        주문 받기
                      </button>
                    )}
                    {state == TicketState.Accepted && (
                      <button
                        className="bg-pink-500 text-white h-full p-2"
                        onClick={async () => {
                          await preparingTicket({ variables: { id } });
                        }}
                      >
                        조리 시작
                      </button>
                    )}
                    {state == TicketState.Preparing && (
                      <button
                        className="bg-rose-500 text-white h-full p-2"
                        onClick={async () => {
                          await readyForPickupTicket({ variables: { id } });
                        }}
                      >
                        픽업 준비
                      </button>
                    )}
                  </div>
                </li>
              ),
            )}
          </ul>
          <button
            className={buttonCls}
            onClick={() =>
              fetchMore({
                variables: {
                  restaurantId,
                  after: tickets[tickets.length - 1].cursor,
                  first: LIMIT,
                },
              })
            }
          >
            더 불러오기
          </button>
        </div>
      )}
    </div>
  );
};

const TicketsPage = (): React.ReactElement => {
  const restaurantId = useContext(restaurantContext);
  if (restaurantId == null) {
    return <>로그인 후 조회 가능합니다.</>;
  }
  return <Tickets restaurantId={restaurantId} />;
};
export default TicketsPage;

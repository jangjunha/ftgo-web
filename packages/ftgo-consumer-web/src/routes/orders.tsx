import { useQuery } from "@apollo/client";
import { gql } from "../__generated__";
import { useContext } from "react";
import consumerContext from "../context";
import { OrderState, TicketState } from "../__generated__/graphql";
import { Link } from "react-router-dom";

const LIST_ORDERS = gql(`
  query ListOrders($consumerId: ID!) {
    consumer(id: $consumerId) {
      orders {
        id
        state
        lineItems {
          menuItemId
          name
          quantity
          price {
            amount
          }
        }
        restaurant {
          name
        }
        ticket {
          state
        }
      }
    }
  }
`);

const State = ({
  orderState,
  ticketState,
}: {
  orderState: OrderState;
  ticketState?: TicketState;
}): React.ReactElement => {
  switch (orderState) {
    case OrderState.ApprovalPending:
      return <>주문 중</>;
    case OrderState.Approved:
      switch (ticketState) {
        case TicketState.AwaitingAcceptance:
          return <>주문 접수 대기</>;
        case TicketState.Accepted:
          return <>주문 접수됨</>;
        case TicketState.Preparing:
          return <>준비 중</>;
        case TicketState.ReadyForPickup:
          return <>픽업 대기</>;
        case TicketState.PickedUp:
          return <>픽업 완료</>;
        case undefined:
        case TicketState.CancelPending:
        case TicketState.Cancelled:
        case TicketState.CreatePending:
        case TicketState.RevisionPending:
          return <></>;
      }
    case OrderState.Cancelled:
      return <>취소됨</>;
    case OrderState.CancelPending:
      return <>취소 대기</>;
    case OrderState.Rejected:
      return <>거절됨</>;
    case OrderState.RevisionPending:
      return <>변경 대기</>;
  }
};

const Orders = ({ consumerId }: { consumerId: string }): React.ReactElement => {
  const { loading, data, error } = useQuery(LIST_ORDERS, {
    variables: { consumerId },
  });
  console.error(error);

  if (loading || data == null) {
    return <>로딩 중...</>;
  }

  const orders = data.consumer.orders;
  return (
    <div className="bg-neutral-100 pb-16">
      <h3 className="p-2">주문 목록</h3>
      <ul className="space-y-0.5">
        {orders.map((order) => (
          <li key={order.id} className="bg-white p-2">
            <Link to={`./${order.id}/`}>
              <p className="font-bold">{order.restaurant?.name}</p>
              <p>
                {order.lineItems[0].name}
                {order.lineItems.length > 1 && " 외"}
                <div>
                  <State
                    orderState={order.state}
                    ticketState={order.ticket?.state}
                  />
                </div>
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {orders.length === 0 && <div>주문 내역이 없습니다.</div>}
    </div>
  );
};

const OrdersPage = (): React.ReactElement => {
  const consumerId = useContext(consumerContext);
  if (consumerId == null) {
    return <>로그인 후 조회 가능합니다.</>;
  }

  return <Orders consumerId={consumerId} />;
};
export default OrdersPage;

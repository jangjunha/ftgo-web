import { useParams } from "react-router-dom";
import { gql } from "../__generated__";
import { useQuery } from "@apollo/client";

const GET_ORDER = gql(`
  query GetOrder($orderId: ID!) {
    order(id: $orderId) {
      id
      lineItems {
        menuItemId
        name
        quantity
        price {
          amount
        }
      }
      restaurant {
        id
        name
      }
      ticket {
        state
      }
    }
  }
`);

const OrderPage = (): React.ReactElement => {
  const { orderId } = useParams();
  if (orderId == null) {
    throw new Error();
  }

  const { data, loading, error } = useQuery(GET_ORDER, {
    variables: { orderId },
  });

  if (loading) {
    return <>불러오는 중...</>;
  }
  if (error || data == null) {
    console.error(error);
    return <>오류가 발생했습니다.</>;
  }

  const {
    order: { restaurant, lineItems },
  } = data;
  return (
    <div className="bg-neutral-100">
      <h3 className="p-2">주문 내역</h3>
      <p className="bg-white p-2">{restaurant?.name}</p>
      <ul className="space-y-0.5 my-2">
        {lineItems.map((item) => (
          <li
            key={item.menuItemId}
            className="bg-white flex justify-between p-2"
          >
            <p>{item.name}</p>
            <p>
              {item.quantity}개{" "}
              {Number.parseFloat(item.price.amount) * item.quantity}원
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default OrderPage;

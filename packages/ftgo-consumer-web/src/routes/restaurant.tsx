import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { gql } from "../__generated__";
import { MenuItem, MenuItemIdAndQuantity } from "../__generated__/graphql";
import { useContext, useState } from "react";
import { produce } from "immer";
import classNames from "classnames";
import consumerContext from "../context";

const GET_RESTAURANT = gql(`
  query GetRestaurant($id: ID!) {
    restaurant(id: $id) {
      id
      name
      menuItems {
        id
        name
        price {
          amount
        }
      }
    }
  }
`);

const PLACE_ORDER = gql(`
  mutation PlaceOrder($order: CreateOrderInput!) {
    createOrder(o: $order) {
      id
    }
  }
`);

const Menu = ({
  menuItems,
  onSubmit,
}: {
  menuItems: MenuItem[];
  onSubmit?(items: MenuItemIdAndQuantity[]): void;
}): React.ReactElement => {
  const [value, setValue] = useState<MenuItemIdAndQuantity[]>(() =>
    menuItems.map((item) => ({ menuItemId: item.id, quantity: 0 })),
  );
  const totalCount = value.reduce((acc, e) => acc + e.quantity, 0);
  return (
    <div>
      <ul className="flex flex-col gap-y-2 px-2 my-4">
        {menuItems.map((menu) => (
          <li key={menu.id} className="flex items-center text-lg">
            <div className="flex-1">
              {menu.name} {menu.price.amount}원
            </div>
            <div>
              <input
                type="number"
                step={1}
                min={0}
                value={value.find((e) => e.menuItemId === menu.id)!.quantity}
                onChange={(ev) => {
                  setValue(
                    produce((draft) => {
                      for (const e of draft) {
                        if (e.menuItemId === menu.id) {
                          e.quantity = parseInt(ev.target.value);
                        }
                      }
                    }),
                  );
                }}
                className="w-16 text-right font-mono bg-slate-100 py-1"
              />
            </div>
          </li>
        ))}
      </ul>
      <button
        className={classNames(
          "w-full text-white bg-orange-500 disabled:bg-orange-200 p-2",
        )}
        disabled={totalCount <= 0}
        onClick={() => onSubmit?.(value.filter((e) => e.quantity > 0))}
      >
        총 {totalCount}개 주문하기
      </button>
    </div>
  );
};

const RestaurantPage = (): React.ReactElement => {
  const { restaurantId } = useParams();
  const consumerId = useContext(consumerContext);
  const navigate = useNavigate();

  const { data } = useQuery(GET_RESTAURANT, {
    variables: { id: restaurantId! },
  });
  const [placeOrder] = useMutation(PLACE_ORDER);

  if (data == null) {
    return <>Loading...</>;
  }

  const handleSubmitOrder = async (items: MenuItemIdAndQuantity[]) => {
    if (consumerId == null) {
      alert("로그인 후 주문할 수 있습니다.");
      return;
    }
    if (restaurantId == null) {
      throw Error();
    }

    const res = await placeOrder({
      variables: {
        order: {
          consumerId,
          restaurantId,
          lineItems: items,
          deliveryAddress: "서울시 강남구 테헤란로 1",
        },
      },
    });
    if (res.errors || res.data == null) {
      alert("오류가 발생했습니다");
      return;
    }
    alert("주문되었습니다.");
    navigate(`/orders/${res.data.createOrder.id}/`);
  };

  const { name, menuItems } = data.restaurant;
  return (
    <div>
      <h3 className="text-center text-xl font-bold my-4">{name}</h3>
      <Menu menuItems={menuItems} onSubmit={handleSubmitOrder} />
    </div>
  );
};
export default RestaurantPage;

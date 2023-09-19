import { useState } from "react";
import { gql } from "../../__generated__";
import {
  MenuItemIdAndQuantity,
  Restaurant,
  SelectConsumerQuery,
  SelectRestaurantQuery,
} from "../../__generated__/graphql";
import { useMutation, useQuery } from "@apollo/client";
import classNames from "classnames";
import { produce } from "immer";

const GET_CONSUMER = gql(`
  query SelectConsumer($id: ID!) {
    consumer(id: $id) {
      id
      name
    }
  }
`);

const GET_RESTAURANT = gql(`
  query SelectRestaurant($id: ID!) {
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

type Stage =
  | { stage: "consumer" }
  | { stage: "restaurant"; consumer: SelectConsumerQuery["consumer"] }
  | {
      stage: "menu";
      consumer: SelectConsumerQuery["consumer"];
      restaurant: SelectRestaurantQuery["restaurant"];
    }
  | {
      stage: "confirm";
      consumer: SelectConsumerQuery["consumer"];
      restaurant: SelectRestaurantQuery["restaurant"];
      items: MenuItemIdAndQuantity[];
    };

const SelectConsumer = ({
  onSelect,
}: {
  onSelect?(consumer: SelectConsumerQuery["consumer"]): void;
}): React.ReactElement => {
  const [id, setId] = useState("");
  const { data } = useQuery(GET_CONSUMER, { variables: { id } });
  return (
    <>
      <h3>고객 선택</h3>
      <input
        type="text"
        placeholder="고객 ID"
        className={classNames("font-mono w-96", {
          "bg-red-100": data == null,
          "bg-green-100": data != null,
        })}
        value={id}
        onChange={(e) => setId(e.currentTarget.value)}
      />
      {data != null && (
        <button
          className="bg-neutral-100 hover:bg-neutral-200 border px-4 mt-2"
          onClick={() => onSelect?.(data.consumer)}
        >
          선택
        </button>
      )}
    </>
  );
};

const SelectRestaurant = ({
  onSelect,
}: {
  onSelect?(restaurant: SelectRestaurantQuery["restaurant"]): void;
}): React.ReactElement => {
  const [id, setId] = useState("");
  const { data } = useQuery(GET_RESTAURANT, { variables: { id } });
  return (
    <>
      <h3>매장 선택</h3>
      <input
        type="text"
        placeholder="매장 ID"
        className={classNames("font-mono w-96", {
          "bg-red-100": data == null,
          "bg-green-100": data != null,
        })}
        value={id}
        onChange={(e) => setId(e.currentTarget.value)}
      />
      {data != null && (
        <button
          className="bg-neutral-100 hover:bg-neutral-200 border px-4 mt-2"
          onClick={() => onSelect?.(data.restaurant)}
        >
          선택
        </button>
      )}
    </>
  );
};

const SelectMenu = ({
  restaurant,
  onSelect,
}: {
  restaurant: Restaurant;
  onSelect?(menuItems: MenuItemIdAndQuantity[]): void;
}): React.ReactElement => {
  const [state, setState] = useState<MenuItemIdAndQuantity[]>(() =>
    restaurant.menuItems.map((menu) => ({ menuItemId: menu.id, quantity: 0 })),
  );
  return (
    <>
      <h3>메뉴 선택</h3>
      <ul>
        {state.map((item, idx) => {
          const menu = restaurant.menuItems.find(
            (menu) => menu.id === item.menuItemId,
          )!;
          return (
            <li key={item.menuItemId}>
              {menu.name} (
              <span className="font-mono">{menu.price.amount}</span>원)
              <input
                type="number"
                min={0}
                value={item.quantity}
                className="w-12 ml-8"
                onChange={(e) =>
                  setState(
                    produce((draft) => {
                      draft[idx].quantity = parseInt(e.target.value);
                    }),
                  )
                }
              />
            </li>
          );
        })}
      </ul>
      <button
        className="bg-neutral-100 hover:bg-neutral-200 border px-4 mt-2"
        onClick={() => onSelect?.(state.filter((item) => item.quantity > 0))}
      >
        선택
      </button>
    </>
  );
};

const PlaceOrderSection = (): React.ReactElement => {
  const [state, setState] = useState<Stage>({ stage: "consumer" });

  const [placeOrder] = useMutation(PLACE_ORDER);

  return (
    <div className="flex flex-col p-4">
      <button
        className="bg-neutral-100 hover:bg-neutral-200 text-red-600 border px-4 mb-4"
        onClick={() => setState({ stage: "consumer" })}
      >
        RESET
      </button>
      {state.stage === "consumer" && (
        <SelectConsumer
          onSelect={(consumer) =>
            setState({ ...state, stage: "restaurant", consumer })
          }
        />
      )}
      {state.stage === "restaurant" && (
        <SelectRestaurant
          onSelect={(restaurant) =>
            setState({ ...state, stage: "menu", restaurant })
          }
        />
      )}
      {state.stage === "menu" && (
        <SelectMenu
          restaurant={state.restaurant}
          onSelect={(items) => setState({ ...state, stage: "confirm", items })}
        />
      )}
      {state.stage === "confirm" && (
        <div>
          <p>
            매장: {state.restaurant.name} (
            <span className="font-mono">{state.restaurant.id}</span>)
          </p>
          <p>
            고객: {state.consumer.name} (
            <span className="font-mono">{state.consumer.id}</span>)
          </p>
          <div>
            <p>
              메뉴: 총{" "}
              {state.items.reduce((acc, item) => acc + item.quantity, 0)}개
            </p>
          </div>
          <p>주문하시겠습니까?</p>
          <button
            className="bg-neutral-100 hover:bg-neutral-200 border px-4 mt-2 w-full"
            onClick={async () => {
              const res = await placeOrder({
                variables: {
                  order: {
                    consumerId: state.consumer.id,
                    restaurantId: state.restaurant.id,
                    lineItems: state.items,
                    deliveryAddress: "서울시 강남구 테헤란로 1",
                  },
                },
              });
              if (res.errors || res.data == null) {
                alert("오류가 발생했습니다");
                return;
              }
              alert("주문되었습니다.");
              setState({ stage: "consumer" });
            }}
          >
            주문
          </button>
        </div>
      )}
    </div>
  );
};
export default PlaceOrderSection;

import { useState } from "react";
import { gql } from "../../__generated__";
import { useMutation, useQuery } from "@apollo/client";
import { MenuItemInput } from "../../__generated__/graphql";
import { nanoid } from "nanoid";
import { produce } from "immer";

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

const CREATE_RESTAURANT = gql(`
  mutation CreateRestaurant($payload: CreateRestaurantInput!) {
    createRestaurant(r: $payload)
  }
`);

const RestaurantInfo = ({ id }: { id: string }): React.ReactElement => {
  const { loading, error, data } = useQuery(GET_RESTAURANT, {
    variables: { id },
  });

  if (error) {
    return <>Error</>;
  }
  if (loading || data == null) {
    return <>Loading</>;
  }

  return (
    <div className="">
      <p className="text-bold">{data.restaurant.name}</p>
      <ul>
        {data.restaurant.menuItems.map((menu) => (
          <li key={menu.id}>
            🍽️ {menu.name} (
            <span className="font-mono">{menu.price.amount}</span>
            원)
          </li>
        ))}
      </ul>
    </div>
  );
};

const generateMenu = (): MenuItemInput => ({
  id: nanoid(),
  name: "",
  price: { amount: "1000" },
});

const CreateRestaurant = ({
  onSubmit,
}: {
  onSubmit?(id: string): void;
}): React.ReactElement => {
  const [name, setName] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItemInput[]>([generateMenu()]);

  const [submit, { loading }] = useMutation(CREATE_RESTAURANT);

  const handleSubmit = async () => {
    const result = await submit({
      variables: { payload: { name, menuItems } },
    });
    if (result.data) {
      onSubmit?.(result.data.createRestaurant);
    } else {
      alert("에러가 발생했습니다.");
    }

    setName("");
    setMenuItems([generateMenu()]);
  };

  return (
    <div className="flex flex-col bg-violet-100 p-4">
      <h3 className="font-bold">매장 생성</h3>
      <div className="flex flex-col gap-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="매장명"
          disabled={loading}
        />
        <div>
          <ul className="flex flex-col gap-y-2">
            {menuItems.map((menu, idx) => (
              <li key={menu.id} className="flex gap-x-2">
                <input
                  type="text"
                  value={menu.name}
                  onChange={(e) =>
                    setMenuItems(
                      produce((draft) => {
                        draft[idx].name = e.target.value;
                      }),
                    )
                  }
                  placeholder="메뉴명"
                  disabled={loading}
                />
                <input
                  type="number"
                  value={menu.price.amount}
                  onChange={(e) => {
                    setMenuItems(
                      produce((draft) => {
                        draft[idx].price.amount = e.target.value;
                      }),
                    );
                  }}
                  className="font-mono"
                  placeholder="가격"
                  disabled={loading}
                />
              </li>
            ))}
          </ul>
          <button
            onClick={() => setMenuItems((prev) => [...prev, generateMenu()])}
            className="bg-neutral-100 hover:bg-neutral-200 border px-4 mt-2"
            disabled={loading}
          >
            메뉴 추가
          </button>
        </div>
      </div>
      <button
        className="bg-neutral-100 hover:bg-neutral-200 border px-4 mt-8"
        onClick={handleSubmit}
        disabled={loading}
      >
        생성
      </button>
    </div>
  );
};

const RestaurantSection = (): React.ReactElement => {
  const [id, setId] = useState("");

  return (
    <section className="flex flex-col gap-y-4">
      <div className="bg-lime-100 p-4">
        <h3 className="font-bold">매장 조회</h3>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.currentTarget.value)}
          className="font-mono w-96"
          placeholder="매장 ID"
        />
        <div className="">{id && <RestaurantInfo id={id} />}</div>
      </div>

      <div className="">
        <CreateRestaurant onSubmit={(id) => setId(id)} />
      </div>
    </section>
  );
};
export default RestaurantSection;

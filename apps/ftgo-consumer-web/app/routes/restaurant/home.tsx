import { Link, Outlet, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { restaurants } from "@ftgo/util";
import { ConsumerLayout } from "~/components/ConsumerLayout";
import { useCart } from "~/lib/cart-context";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Restaurant ${params.restaurantId} - FTGO Consumer` },
    { name: "description", content: "Restaurant Detail" },
  ];
}

export default function Restaurant() {
  const { restaurantId } = useParams();
  const { addItem, items, getTotalItems, getTotalPrice, updateQuantity } =
    useCart();

  const { isLoading, data } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => restaurants.get(restaurantId!),
    enabled: !!restaurantId,
  });

  if (isLoading || data === undefined) {
    return (
      <div className="flex items-center justify-center h-64 animate-pulse">
        <div className="text-lg">Loading ...</div>
      </div>
    );
  }

  const menus = data.menu_items;

  const getItemQuantity = (menuItemId: string) => {
    const item = items.find((item) => item.menuItemId === menuItemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (menuItem: {
    id: string;
    name: string;
    price: string;
  }) => {
    addItem({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: parseFloat(menuItem.price),
    });
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mx-4 mb-4">
        <h2 className="font-bold text-2xl">Menu</h2>
        {
          <Link
            to={`/restaurant/${restaurantId}/cart`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Cart ${getTotalPrice().toLocaleString()}
          </Link>
        }
      </div>

      <ul className="grid grid-cols-3 gap-2 mx-4">
        {menus.map(({ id, name, price }) => {
          const quantity = getItemQuantity(id);
          return (
            <li key={id} className="flex flex-col">
              <div className="bg-gray-100 p-4">
                <p className="font-bold">{name}</p>
                <p className="mb-2">${parseFloat(price).toLocaleString()}</p>

                {
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleAddToCart({ id, name, price })}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      +
                    </button>
                    <span className="font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(id, quantity - 1)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      -
                    </button>
                  </div>
                }
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

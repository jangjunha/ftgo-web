import { Link, Outlet, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { restaurants } from "@ftgo/util";
import { ConsumerLayout } from "~/components/ConsumerLayout";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Restaurant ${params.restaurantId} - FTGO Consumer` },
    { name: "description", content: "Restaurant Detail" },
  ];
}

export default function Restaurant() {
  const { restaurantId } = useParams();

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

  return (
    <div className="py-4">
      <h2 className="font-bold text-2xl mx-4 mb-2">Menu</h2>
      <ul className="grid grid-cols-3 gap-2 mx-4">
        {menus.map(({ id, name, price }) => (
          <li key={id} className="flex flex-col">
            <button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 p-4 cursor-pointer"
            >
              <p className="font-bold">{name}</p>
              <p>${price}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

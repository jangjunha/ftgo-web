import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/home";
import { restaurants } from "@ftgo/util";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Restaurants - FTGO Consumer" },
    { name: "description", content: "Browse restaurants to order" },
  ];
}

export default function Restaurants() {
  const { data, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: restaurants.list,
  });

  return (
    <div className="py-4">
      <h1 className="mx-4 mb-2 font-bold text-2xl">Browse Restaurants</h1>
      {data?.restaurants.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">
            No restaurants yet
          </h3>
        </div>
      )}
      {data && (
        <div>
          <ul className="mx-4 grid grid-cols-4 gap-4">
            {data.restaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.id}`}
                  className="p-4 flex flex-col bg-gray-100 hover:bg-gray-200"
                >
                  <p className="font-bold">{restaurant.name}</p>
                  <ul>
                    {restaurant.menu_items.slice(0, 3).map((menu, idx) => (
                      <li
                        key={idx}
                        className="bg-gray-200 inline px-1 text-xs text-gray-500"
                      >
                        {menu.name}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isLoading && (
        <div className="text-center py-12 animate-pulse">
          Loading restaurants...
        </div>
      )}
    </div>
  );
}

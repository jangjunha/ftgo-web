import { Link, Outlet, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/restaurant";
import { restaurants } from "@ftgo/util";
import { RestaurantLayout } from "../components/RestaurantLayout";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Restaurant ${params.restaurantId} - FTGO Restaurant` },
    { name: "description", content: "Restaurant management dashboard" },
  ];
}

export default function Restaurant() {
  const { restaurantId } = useParams();

  const restaurantQuery = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => restaurants.get(restaurantId!),
    enabled: !!restaurantId,
  });

  if (restaurantQuery.isLoading) {
    return (
      <RestaurantLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading restaurant...</div>
        </div>
      </RestaurantLayout>
    );
  }

  if (restaurantQuery.error) {
    return (
      <RestaurantLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">
            Error loading restaurant: {restaurantQuery.error.message}
          </div>
        </div>
      </RestaurantLayout>
    );
  }

  const restaurant = restaurantQuery.data;

  return (
    <RestaurantLayout
      sidebar={
        <div className="py-4 mb-4">
          <Link to="/restaurants" className="text-sm text-gray-600 px-2">
            ‹ Restaurants
          </Link>
          {restaurant && (
            <>
              <div className="bg-violet-200 p-2">
                <h1 className="font-bold text-gray-900">{restaurant?.name}</h1>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
              </div>
            </>
          )}
          <div className="mt-4">
            <p className="text-gray-500 font-bold text-sm mx-2 my-1">Menu</p>
            <ul className="flex flex-col divide-y [&_li]:flex [&_li]:flex-1 [&_li]:bg-white [&_a]:flex-1 [&_a]:p-2">
              <li>
                <Link to={`/restaurants/${restaurantId}/tickets`}>Tickets</Link>
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <Outlet />
    </RestaurantLayout>
  );
}

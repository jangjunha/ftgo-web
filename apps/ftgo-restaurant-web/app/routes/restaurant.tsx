import { Outlet, useParams } from "react-router";
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
    <RestaurantLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{restaurant?.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="text-gray-900">{restaurant?.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Menu Items</h3>
              <p className="text-gray-900">{restaurant?.menu_items.length} items</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="text-green-600 font-medium">Active</p>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </RestaurantLayout>
  );
}
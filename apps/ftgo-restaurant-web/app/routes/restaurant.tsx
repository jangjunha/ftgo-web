import { Outlet, useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/restaurant";
import { restaurants } from "@ftgo/util";
import { useAuth } from "../lib/auth-context";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Restaurant ${params.restaurantId} - FTGO Restaurant` },
    { name: "description", content: "Restaurant management dashboard" },
  ];
}

export default function Restaurant() {
  const { restaurantId } = useParams();
  const { user, logout } = useAuth();

  const restaurantQuery = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => restaurants.get(restaurantId!),
    enabled: !!restaurantId,
  });

  if (restaurantQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading restaurant...</div>
      </div>
    );
  }

  if (restaurantQuery.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Error loading restaurant: {restaurantQuery.error.message}
        </div>
      </div>
    );
  }

  const restaurant = restaurantQuery.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link
                to="/restaurants"
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← Back to Restaurants
              </Link>
              <h1 className="text-xl font-semibold">{restaurant?.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <p className="text-gray-600">{restaurant?.address}</p>
            <p className="text-sm text-gray-500">
              {restaurant?.menu_items.length} menu items
            </p>
          </div>

          <nav className="flex space-x-8 mb-6">
            <Link
              to={`/restaurants/${restaurantId}`}
              className="text-indigo-600 hover:text-indigo-800 font-medium border-b-2 border-indigo-600 pb-2"
            >
              Kitchen Tickets
            </Link>
          </nav>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
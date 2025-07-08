import { Link, Outlet, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/layout";
import { restaurants } from "@ftgo/util";
import { ConsumerLayout } from "~/components/ConsumerLayout";
import { CartProvider, useCart } from "~/lib/cart-context";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Restaurant ${params.restaurantId} - FTGO Restaurant` },
    { name: "description", content: "Restaurant management dashboard" },
  ];
}

function RestaurantContent() {
  const { restaurantId } = useParams();

  const restaurantQuery = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => restaurants.get(restaurantId!),
    enabled: !!restaurantId,
  });
  const cart = useCart();

  if (restaurantQuery.isLoading) {
    return (
      <ConsumerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading restaurant...</div>
        </div>
      </ConsumerLayout>
    );
  }

  if (restaurantQuery.error) {
    return (
      <ConsumerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">
            Error loading restaurant: {restaurantQuery.error.message}
          </div>
        </div>
      </ConsumerLayout>
    );
  }

  const restaurant = restaurantQuery.data;

  return (
    <ConsumerLayout
      sidebar={
        <div className="py-4 mb-4">
          <Link to="/restaurants" className="text-sm text-gray-600 px-2">
            ‹ Restaurants
          </Link>
          {restaurant && (
            <>
              <div className="bg-orange-200 p-2">
                <h1 className="font-bold text-gray-900">{restaurant?.name}</h1>
                <p className="text-sm text-gray-600">{restaurant.address}</p>
              </div>
            </>
          )}
          <div className="mt-4">
            <p className="text-gray-500 font-bold text-sm mx-2 my-1">Menu</p>
            <ul className="flex flex-col divide-y divide-orange-100 [&_li]:flex [&_li]:flex-1 [&_li]:bg-white [&_a]:flex-1 [&_a]:p-2">
              <li>
                <Link to={`/restaurant/${restaurantId}`}>Menu</Link>
              </li>
              <li>
                <Link to={`/restaurant/${restaurantId}/cart`}>
                  Cart{" "}
                  <span className="bg-red-500 text-white text-xs px-1 rounded-2xl">
                    {cart.getTotalItems()}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      }
    >
      <Outlet />
    </ConsumerLayout>
  );
}

export default function Restaurant() {
  const { restaurantId } = useParams();

  if (!restaurantId) {
    return <div>Restaurant ID not found</div>;
  }

  return (
    <CartProvider restaurantId={restaurantId}>
      <RestaurantContent />
    </CartProvider>
  );
}

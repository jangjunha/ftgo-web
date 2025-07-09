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

  const restaurant = restaurantQuery.data;
  return (
    <>
      <h1 className="font-bold text-xl p-4">{restaurant?.name}</h1>
      <Outlet />
    </>
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

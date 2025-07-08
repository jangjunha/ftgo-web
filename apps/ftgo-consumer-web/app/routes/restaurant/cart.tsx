import { useParams } from "react-router";
import type { Route } from "./+types/cart";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Kitchen Tickets - Restaurant ${params.restaurantId}` },
    { name: "description", content: "Manage kitchen tickets and orders" },
  ];
}

export default function Tickets() {
  const { restaurantId } = useParams();
  return <p>{restaurantId}</p>;
}

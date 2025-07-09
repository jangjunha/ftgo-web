import { useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/order_detail";
import { orders, restaurants } from "@ftgo/util";
import { useParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FTGO Consumer" },
    { name: "description", content: "FTGO Consumer" },
  ];
}

export default function OrderDetail({}: Route.ComponentProps) {
  const { orderId } = useParams();

  const { data: order } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orders.get(orderId!),
  });

  const { data: restaurant } = useQuery({
    queryKey: ["restaurants", order?.restaurant_id],
    queryFn: () => restaurants.get(order!.restaurant_id),
    enabled: !!order,
  });

  return (
    <div className="bg-neutral-100 min-h-full">
      <h3 className="p-2 text-xl font-bold">
        Order <span className="font-mono text-sm">{orderId}</span>
      </h3>
      <p className="bg-white p-2">{restaurant?.name}</p>
      {!order && <p>Loading...</p>}
      {order && (
        <ul className="space-y-0.5 my-2">
          {order.line_items.map((item) => (
            <li
              key={item.menu_item_id}
              className="bg-white flex justify-between p-2"
            >
              <p>{item.name}</p>
              <p>
                {item.quantity}EA $
                {Number.parseFloat(item.price) * item.quantity}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

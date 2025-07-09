import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/orders";
import { orders, restaurants, type Order } from "@ftgo/util";
import { useAuth } from "~/lib/auth-context";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FTGO Consumer" },
    { name: "description", content: "FTGO Consumer" },
  ];
}

const OrderItem = ({ order }: { order: Order }) => {
  const { data: restaurant } = useQuery({
    queryKey: ["restaurants", order.restaurant_id],
    queryFn: () => restaurants.get(order.restaurant_id),
  });

  return (
    <li className="flex flex-col">
      <span className="font-mono text-xs text-gray-500 mx-4 mb-1">
        {order.id}
      </span>
      <Link
        to={`./${order.id}`}
        className="flex-1 bg-white cursor-pointer px-4 py-2"
      >
        <p className="font-bold">{restaurant?.name}</p>
        <p>{order.state}</p>
      </Link>
    </li>
  );
};

const ITEMS_PER_PAGE = 5;

const ConsumerOrders = ({ id }: { id: string }) => {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: ({ pageParam: { first, last, before, after } }) =>
      orders.list({ consumer_id: id, first, last, before, after }),
    initialPageParam: { first: ITEMS_PER_PAGE } as {
      first?: number;
      after?: string;
      last?: number;
      before?: string;
    },
    getPreviousPageParam: (firstPage) => {
      const first = firstPage.edges.at(0);
      return first
        ? {
            first: undefined,
            last: ITEMS_PER_PAGE,
            after: undefined,
            before: first.cursor,
          }
        : null;
    },
    getNextPageParam: (lastPage) => {
      const last = lastPage.edges.at(-1);
      return last
        ? {
            first: ITEMS_PER_PAGE,
            last: undefined,
            after: last.cursor,
            before: undefined,
          }
        : null;
    },
  });
  return (
    <div className="bg-gray-100 min-h-full">
      <h1 className="font-bold text-2xl m-4">Orders</h1>
      {data && (
        <ul className="space-y-4">
          {data.pages
            .flatMap((pages) => pages.edges)
            .map(({ node, cursor }) => (
              <OrderItem order={node} key={cursor} />
            ))}
        </ul>
      )}
      <div className="my-4 text-center">
        {hasNextPage && (
          <button
            type="button"
            disabled={isLoading}
            className="p-2 cursor-pointer text-blue-500 disabled:text-gray-300"
            onClick={async () => await fetchNextPage()}
          >
            Load more previous orders
          </button>
        )}
        {!hasNextPage && (
          <p className="p-2 text-gray-400">This is end of your order history</p>
        )}
      </div>
    </div>
  );
};

export default function Orders({}: Route.ComponentProps) {
  const { user } = useAuth();
  return (
    <>
      {user === null && <p>You should sign in first to view your orders.</p>}
      {user !== null && <ConsumerOrders id={user.consumerId} />}
    </>
  );
}

import { useParams, Link } from "react-router";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/tickets";
import { kitchen, type KitchenTicket } from "@ftgo/util";
import State from "~/components/state";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Kitchen Tickets - Restaurant ${params.restaurantId}` },
    { name: "description", content: "Manage kitchen tickets and orders" },
  ];
}

export default function Tickets() {
  const { restaurantId } = useParams();
  const [loadPrevRef, setLoadPrevRef] = useState<HTMLDivElement | null>(null);
  const [loadNextRef, setLoadNextRef] = useState<HTMLDivElement | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    dataUpdatedAt,
  } = useInfiniteQuery({
    queryKey: ["tickets", restaurantId],
    queryFn: ({ pageParam }) => kitchen.listTickets(restaurantId!, pageParam),
    initialPageParam: { last: 10 } as {
      first?: number;
      after?: string;
      last?: number;
      before?: string;
    },
    getPreviousPageParam: (firstPage) => {
      const first = firstPage.edges.at(0);
      return first
        ? { first: undefined, last: 10, after: undefined, before: first.cursor }
        : null;
    },
    getNextPageParam: (lastPage) => {
      const last = lastPage.edges.at(-1);
      return last
        ? { first: 10, last: undefined, after: last.cursor, before: undefined }
        : null;
    },
    enabled: !!restaurantId,
  });

  // Extract all tickets from all pages
  const tickets =
    data?.pages.flatMap((page) => page.edges.map((edge) => edge.node)) || [];

  // Use IntersectionObserver to detect when to load more tickets
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "0%" },
    );
    if (loadNextRef) {
      observer.observe(loadNextRef);
    }
    return () => observer.disconnect();
  }, [loadNextRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Use IntersectionObserver to detect when user is at the top for auto-refresh
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [target] = entries;
        setIsAutoRefreshEnabled(target.isIntersecting);
      },
      { threshold: 0, rootMargin: "0%" },
    );
    if (loadPrevRef) {
      observer.observe(loadPrevRef);
    }
    return () => observer.disconnect();
  }, [loadPrevRef]);

  // Auto-refresh new tickets every 5 seconds when at top
  useEffect(() => {
    if (isAutoRefreshEnabled && !isFetchingPreviousPage) {
      intervalRef.current = setInterval(() => {
        fetchPreviousPage();
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, isFetchingPreviousPage, fetchPreviousPage]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">
          Error loading tickets: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold">Tickets</h1>
          <div>
            <p className="text-sm text-gray-700">
              Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div
          className={`w-full text-center py-1 text-xs font-medium ${
            isAutoRefreshEnabled
              ? "bg-green-100 text-green-800 animate-pulse"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isAutoRefreshEnabled
            ? "🔄 Auto-refresh ON while on top"
            : "⏸️ Auto-refresh OFF"}
        </div>
      </div>
      <div>
        {/* Top trigger for auto-refresh detection */}
        <div ref={setLoadPrevRef} className="h-1 w-full" />

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              No tickets yet
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              New orders will appear here when they come in.
            </p>
          </div>
        ) : (
          <>
            {isFetchingPreviousPage && (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">
                  Loading new tickets...
                </div>
              </div>
            )}

            <ul className="flex flex-col">
              {tickets.map((ticket) => (
                <Ticket
                  id={ticket.id}
                  restaurantId={restaurantId!!}
                  key={ticket.id}
                />
              ))}
            </ul>

            {isFetchingNextPage && (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">
                  Loading more tickets...
                </div>
              </div>
            )}

            {hasNextPage && !isFetchingNextPage && (
              <div ref={setLoadNextRef} className="text-center py-8">
                <div className="text-sm text-gray-500">
                  Scroll to load more tickets...
                </div>
              </div>
            )}

            {!hasNextPage && tickets.length > 0 && (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">
                  No more tickets to load
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const Ticket = ({ id, restaurantId }: { id: string; restaurantId: string }) => {
  const { data, refetch } = useQuery({
    queryKey: ["tickets", id],
    queryFn: () => kitchen.getTicket(restaurantId, id),
  });
  const { mutateAsync: acceptTicket } = useMutation({
    mutationFn: (readyBy: string) =>
      kitchen.acceptTicket(restaurantId, id, { ready_by: readyBy }),
    async onSuccess() {
      await refetch();
    },
  });
  const { mutateAsync: preparingTicket } = useMutation({
    mutationFn: () => kitchen.preparingTicket(restaurantId, id),
    async onSuccess() {
      await refetch();
    },
  });
  const { mutateAsync: readyForPickupTicket } = useMutation({
    mutationFn: () => kitchen.readyForPickupTicket(restaurantId, id),
    async onSuccess() {
      await refetch();
    },
  });

  if (data === undefined) {
    return (
      <li>
        <p>Loading {id}</p>
      </li>
    );
  }

  const { state, ready_by: readyBy, line_items: lineItems } = data;
  return (
    <li className="flex">
      <Link to={`./${id}`} className="flex-1 p-2 flex flex-col bg-white">
        <div>
          {/* <span className="font-mono bg-black text-white px-1">{sequence}</span> */}
          <div className="inline ml-2">
            <State state={state} />
            {state === "ACCEPTED" && readyBy && (
              <span className="ml-1">
                Ready by {new Date(readyBy).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <p>{lineItems[0].name}...</p>
      </Link>
      <div>
        {state === "AWAITING_ACCEPTANCE" && (
          <button
            type="button"
            className="bg-fuchsia-500 text-white h-full p-2 cursor-pointer"
            onClick={async () => {
              const minutes = parseInt(
                prompt("Expected cooking time (min)", "15") ?? "",
              );
              if (Number.isNaN(minutes)) {
                return;
              }
              const readyBy = new Date();
              readyBy.setTime(readyBy.getTime() + 1000 * 60 * minutes);
              await acceptTicket(readyBy.toISOString());
            }}
          >
            Accept
          </button>
        )}
        {state === "ACCEPTED" && (
          <button
            type="button"
            className="bg-pink-500 text-white h-full p-2 cursor-pointer"
            onClick={async () => {
              await preparingTicket();
            }}
          >
            Start Cook
          </button>
        )}
        {state === "PREPARING" && (
          <button
            type="button"
            className="bg-rose-500 text-white h-full p-2 cursor-pointer"
            onClick={async () => {
              await readyForPickupTicket();
            }}
          >
            Request Pickup
          </button>
        )}
      </div>
    </li>
  );
};

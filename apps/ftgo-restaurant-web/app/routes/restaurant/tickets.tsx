import { useParams, Link } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/tickets";
import { kitchen } from "@ftgo/util";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Kitchen Tickets - Restaurant ${params.restaurantId}` },
    { name: "description", content: "Manage kitchen tickets and orders" },
  ];
}

function getStatusColor(state: string) {
  switch (state.toLowerCase()) {
    case "created":
    case "awaiting_acceptance":
      return "bg-yellow-100 text-yellow-800";
    case "accepted":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready_for_pickup":
      return "bg-green-100 text-green-800";
    case "picked_up":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatStatus(state: string) {
  return state.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/restaurants/${restaurantId}/tickets/${ticket.id}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Ticket #{ticket.id.slice(-8)}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.state)}`}
                      >
                        {formatStatus(ticket.state)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {ticket.line_items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                      {ticket.order_id && (
                        <div>Order: {ticket.order_id.slice(-8)}</div>
                      )}
                      {ticket.accepted_at && (
                        <div>
                          Accepted:{" "}
                          {new Date(ticket.accepted_at).toLocaleTimeString()}
                        </div>
                      )}
                      {ticket.preparing_at && (
                        <div>
                          Started:{" "}
                          {new Date(ticket.preparing_at).toLocaleTimeString()}
                        </div>
                      )}
                      {ticket.ready_for_pickup_at && (
                        <div>
                          Ready:{" "}
                          {new Date(
                            ticket.ready_for_pickup_at,
                          ).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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

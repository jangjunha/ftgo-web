import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
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
  return state.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export default function Tickets() {
  const { restaurantId } = useParams();

  const ticketsQuery = useQuery({
    queryKey: ["tickets", restaurantId],
    queryFn: () => kitchen.listTickets(restaurantId!),
    enabled: !!restaurantId,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (ticketsQuery.isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading tickets...</div>
      </div>
    );
  }

  if (ticketsQuery.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">
          Error loading tickets: {ticketsQuery.error.message}
        </div>
      </div>
    );
  }

  const tickets = ticketsQuery.data?.tickets || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Kitchen Tickets</h2>
        <div className="text-sm text-gray-500">
          Auto-refreshing every 5 seconds
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No tickets yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            New orders will appear here when they come in.
          </p>
        </div>
      ) : (
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
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.state)}`}>
                    {formatStatus(ticket.state)}
                  </span>
                </div>

                <div className="space-y-2">
                  {ticket.line_items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
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
                    <div>Accepted: {new Date(ticket.accepted_at).toLocaleTimeString()}</div>
                  )}
                  {ticket.preparing_at && (
                    <div>Started: {new Date(ticket.preparing_at).toLocaleTimeString()}</div>
                  )}
                  {ticket.ready_for_pickup_at && (
                    <div>Ready: {new Date(ticket.ready_for_pickup_at).toLocaleTimeString()}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
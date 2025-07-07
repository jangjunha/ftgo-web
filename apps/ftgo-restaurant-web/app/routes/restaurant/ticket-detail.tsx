import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Route } from "./+types/ticket-detail";
import { kitchen } from "@ftgo/util";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Ticket ${params.ticketId} - Restaurant ${params.restaurantId}` },
    { name: "description", content: "Ticket details and actions" },
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

export default function TicketDetail() {
  const { restaurantId, ticketId } = useParams();
  const queryClient = useQueryClient();

  const ticketQuery = useQuery({
    queryKey: ["ticket", restaurantId, ticketId],
    queryFn: () => kitchen.getTicket(restaurantId!, ticketId!),
    enabled: !!restaurantId && !!ticketId,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const acceptMutation = useMutation({
    mutationFn: () => kitchen.acceptTicket(restaurantId!, ticketId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", restaurantId, ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets", restaurantId] });
    },
  });

  const preparingMutation = useMutation({
    mutationFn: () => kitchen.preparingTicket(restaurantId!, ticketId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", restaurantId, ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets", restaurantId] });
    },
  });

  const readyMutation = useMutation({
    mutationFn: () => kitchen.readyForPickupTicket(restaurantId!, ticketId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", restaurantId, ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets", restaurantId] });
    },
  });

  if (ticketQuery.isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading ticket...</div>
      </div>
    );
  }

  if (ticketQuery.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">
          Error loading ticket: {ticketQuery.error.message}
        </div>
      </div>
    );
  }

  const ticket = ticketQuery.data;
  if (!ticket) return null;

  const canAccept = ticket.state === "created" || ticket.state === "awaiting_acceptance";
  const canStartPreparing = ticket.state === "accepted";
  const canMarkReady = ticket.state === "preparing";

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/restaurants/${restaurantId}`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Tickets
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket #{ticket.id.slice(-8)}
            </h1>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(ticket.state)}`}>
              {formatStatus(ticket.state)}
            </span>
          </div>
          {ticket.order_id && (
            <p className="text-sm text-gray-500 mt-1">
              Order: {ticket.order_id.slice(-8)}
            </p>
          )}
        </div>

        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {ticket.line_items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">ID: {item.menu_item_id}</span>
                </div>
                <span className="font-medium">Qty: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
          <div className="space-y-2 text-sm">
            <div className="text-gray-600">
              Created: {new Date(ticket.id).toLocaleString()} {/* Using ID as creation time placeholder */}
            </div>
            {ticket.accepted_at && (
              <div className="text-gray-600">
                Accepted: {new Date(ticket.accepted_at).toLocaleString()}
              </div>
            )}
            {ticket.preparing_at && (
              <div className="text-gray-600">
                Started Preparing: {new Date(ticket.preparing_at).toLocaleString()}
              </div>
            )}
            {ticket.ready_for_pickup_at && (
              <div className="text-gray-600">
                Ready for Pickup: {new Date(ticket.ready_for_pickup_at).toLocaleString()}
              </div>
            )}
            {ticket.ready_by && (
              <div className="text-gray-600">
                Expected Ready By: {new Date(ticket.ready_by).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            {canAccept && (
              <button
                onClick={() => acceptMutation.mutate()}
                disabled={acceptMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {acceptMutation.isPending ? "Accepting..." : "Accept Ticket"}
              </button>
            )}
            
            {canStartPreparing && (
              <button
                onClick={() => preparingMutation.mutate()}
                disabled={preparingMutation.isPending}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {preparingMutation.isPending ? "Starting..." : "Start Preparing"}
              </button>
            )}
            
            {canMarkReady && (
              <button
                onClick={() => readyMutation.mutate()}
                disabled={readyMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {readyMutation.isPending ? "Marking Ready..." : "Mark Ready for Pickup"}
              </button>
            )}
          </div>

          {(acceptMutation.error || preparingMutation.error || readyMutation.error) && (
            <div className="text-red-600 text-sm mt-2">
              Error: {acceptMutation.error?.message || preparingMutation.error?.message || readyMutation.error?.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
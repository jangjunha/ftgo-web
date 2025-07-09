import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useAuth } from "~/lib/auth-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  delivery,
  type CourierActionResponse,
  type CourierActionType,
} from "@ftgo/util";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FTGO Courier" },
    { name: "description", content: "FTGO Courier" },
  ];
}

const ActionType = ({
  type,
}: {
  type: CourierActionType;
}): React.ReactElement => {
  switch (type) {
    case "PICKUP":
      return <span className="bg-orange-600 text-white px-2">Pickup</span>;
    case "DROPOFF":
      return <span className="bg-lime-600 text-white px-2">Dropoff</span>;
  }
};

const Delivery = ({
  action,
  onAction,
}: {
  action: CourierActionResponse;
  onAction?: () => Promise<void>;
}) => {
  const { delivery_id: id, action_type: actionType } = action;

  const orderQuery = useQuery({
    queryKey: ["deliveries", id, "order"],
    queryFn: () => delivery.getStatus(id),
  });
  const order = orderQuery.data;

  const pickupMutation = useMutation({
    mutationFn: () => delivery.pickup(id),
  });
  const dropoffMutation = useMutation({
    mutationFn: () => delivery.dropoff(id),
  });

  return (
    <li
      key={`${action.delivery_id}-${action.action_type}`}
      className="bg-white px-2 py-1 flex"
    >
      <div className="flex-1">
        <span className="font-mono bg-black text-white px-1">
          {action.delivery_id.slice(0, 5)}
        </span>
        <span className="ml-2">
          <ActionType type={action.action_type} />
        </span>
        <p>{action.address}</p>
        <p>Scheduled: {new Date(action.scheduled_time).toLocaleString()}</p>
      </div>
      <div className="flex">
        {order !== undefined && (
          <>
            {actionType === "PICKUP" && (
              <button
                type="button"
                className={[
                  "bg-rose-500 disabled:bg-neutral-200 text-white px-4",
                  dropoffMutation.isPending && "animate-pulse",
                ]
                  .filter(Boolean)
                  .join(" ")}
                disabled={order.pickup_time !== null}
                onClick={async () => {
                  try {
                    await pickupMutation.mutateAsync();
                    await onAction?.();
                    window.alert("Successfully processed as picked-up");
                  } catch (e) {
                    // if (e instanceof Error && isApolloError(e)) {
                    //   const message = e.graphQLErrors[0].message;
                    //   if (message.includes("FAILED_PRECONDITION")) {
                    //     window.alert(
                    //       "아직 준비되지 않았습니다.\n음식이 준비되었다면 매장에 픽업 준비 처리를 요청해주세요.",
                    //     );
                    //     return;
                    //   } else if (message.includes("ALREADY_EXISTS")) {
                    //     window.alert("이미 픽업 처리 되었습니다.");
                    //     return;
                    //   }
                    // }
                    throw e;
                  }
                }}
              >
                Pickup
              </button>
            )}
            {actionType === "DROPOFF" && (
              <button
                type="button"
                className={[
                  "bg-green-500 disabled:bg-neutral-200 text-white px-4",
                  dropoffMutation.isPending && "animate-pulse",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={async () => {
                  await dropoffMutation.mutateAsync();
                  await onAction?.();
                }}
                disabled={order.pickup_time === null}
              >
                Dropoff
              </button>
            )}
          </>
        )}
      </div>
    </li>
  );
};

const Content = ({ courierId }: { courierId: string }) => {
  const { data: courier, ...courierQuery } = useQuery({
    queryKey: ["couriers", courierId],
    queryFn: () => delivery.getCourier(courierId),
  });
  const planQuery = useQuery({
    queryKey: ["couriers", courierId, "plans"],
    queryFn: () => delivery.getCourierPlan(courierId),
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (available: boolean) =>
      delivery.updateCourierAvailability(courierId, { available }),
    onSuccess: async () => {
      await courierQuery.refetch();
    },
  });

  const actions = planQuery.data?.actions;
  if (courierQuery.isError) {
    console.error(courierQuery.error);
    return "Error";
  }
  if (planQuery.isError) {
    console.error(planQuery.error);
    return "Error";
  }
  if (
    courierQuery.isLoading ||
    courier === undefined ||
    actions === undefined
  ) {
    return "Loading";
  }

  return (
    <div className="bg-neutral-100 py-2">
      <section className="p-4 mb-4 flex justify-center gap-4">
        <p className="text-xl">
          Now{" "}
          <span className="font-bold">
            {courier.available ? "taking orders" : "closed"}
          </span>
        </p>
        <button
          type="button"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4"
          onClick={async () => {
            await updateAvailabilityMutation.mutateAsync(!courier.available);
          }}
        >
          {courier.available ? "Close" : "Open"}
        </button>
      </section>
      <section className="pb-16">
        <button
          type="button"
          className="bg-emerald-500 disabled:bg-gray-400 hover:bg-emerald-600 text-white w-full py-2 mb-2"
          disabled={planQuery.isFetching}
          onClick={async () => await planQuery.refetch()}
        >
          Refresh
        </button>
        {actions.length === 0 && (
          <div className="text-center p-4">
            There are currently no dispatched orders.
          </div>
        )}
        <ul className="flex flex-col gap-y-0.5">
          {actions.map((action) => (
            <Delivery
              action={action}
              key={action.delivery_id}
              onAction={async () => {
                await planQuery.refetch();
              }}
            />
          ))}
        </ul>
        <footer className="mt-4 p-2 text-sm">
          <h4 className="font-bold">Notice</h4>
          <p>
            * Dispatch will be made when the order is <b>approved</b> at the
            store.
          </p>
          <p>
            * Dispatch will be made to a <b>random</b> delivery person who is
            currently in operation.
          </p>
          <p>
            * Pickup is possible after pressing the pick-up preparation button
            at the store.
          </p>
          <p>
            * Orders that have been delivered will be deleted from the list.
          </p>
        </footer>
      </section>
    </div>
  );
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user === null) {
    navigate("/sign-in");
    return <>Loading...</>;
  }

  return <Content courierId={user.courierId} />;
}

import { isApolloError, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import courierContext from "../context";
import { gql } from "../__generated__";
import { DeliveryAction } from "../__generated__/graphql";

const GET_COURIER = gql(`
  query GetCourier($id: ID!) {
    courier(id: $id) {
      id
      available
      plan {
        actions {
          type
          address
          delivery {
            id
            pickupTime
          }
          time
        }
      }
    }
  }
`);

const UPDATE_AVAILABILITY = gql(`
  mutation UpdateCourierAvailability($id: ID!, $available: Boolean!) {
    updateCourierAvailability(id: $id, available: $available) {
      id
      available
    }
  }
`);

const PICKUP = gql(`
  mutation PickupDelivery($id: ID!) {
    pickupDelivery(id: $id)
  }
`);

const DROPOFF = gql(`
  mutation DropoffDelivery($id: ID!) {
    dropoffDelivery(id: $id)
  }
`);

const ActionType = ({ type }: { type: DeliveryAction }): React.ReactElement => {
  switch (type) {
    case DeliveryAction.Pickup:
      return <span className="bg-orange-600 text-white px-2">픽업</span>;
    case DeliveryAction.Dropoff:
      return <span className="bg-lime-600 text-white px-2">배송</span>;
  }
};

const UserSection = ({ id }: { id: string }): React.ReactElement => {
  const { loading, error, data, refetch } = useQuery(GET_COURIER, {
    variables: { id },
  });

  const [updateAvailability] = useMutation(UPDATE_AVAILABILITY);
  const [pickup] = useMutation(PICKUP);
  const [dropoff] = useMutation(DROPOFF);

  if (error) {
    console.error(error);
    return <>Error</>;
  }
  if (loading || data == null) {
    return <>Loading</>;
  }

  console.log(data.courier.plan.actions);
  return (
    <div className="bg-neutral-100 py-2">
      <section className="p-4 mb-4 flex justify-center gap-4">
        <p className="text-xl">
          현재{" "}
          <span className="font-bold">
            {data.courier.available ? "주문 받는 중" : "영업 종료"}
          </span>
        </p>
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4"
          onClick={async () => {
            await updateAvailability({
              variables: { id, available: !data.courier.available },
            });
          }}
        >
          {data.courier.available ? "영업 종료" : "영업 시작"}
        </button>
      </section>
      <section className="pb-16">
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white w-full py-2 mb-2"
          onClick={() => refetch()}
        >
          새로고침
        </button>
        {data.courier.plan.actions.length === 0 && (
          <div className="text-center p-4">현재 배차된 주문이 없습니다.</div>
        )}
        <ul className="flex flex-col gap-y-0.5">
          {data.courier.plan.actions.map((action) => (
            <li
              key={`${action.delivery.id}-${action.type}`}
              className="bg-white px-2 py-1 flex"
            >
              <div className="flex-1">
                <span className="font-mono bg-black text-white px-1">
                  {action.delivery.id.slice(0, 5)}
                </span>
                <span className="ml-2">
                  <ActionType type={action.type} />
                </span>
                <p>{action.address}</p>
                <p>예정 시각: {new Date(action.time).toLocaleString()}</p>
              </div>
              <div className="flex">
                {action.type == DeliveryAction.Pickup && (
                  <button
                    className="bg-rose-500 disabled:bg-neutral-200 text-white px-4"
                    disabled={action.delivery.pickupTime != null}
                    onClick={async () => {
                      try {
                        await pickup({
                          variables: { id: action.delivery.id },
                        });
                        await refetch();
                        window.alert("정상적으로 픽업 처리되었습니다.");
                      } catch (e) {
                        if (e instanceof Error && isApolloError(e)) {
                          const message = e.graphQLErrors[0].message;
                          if (message.includes("FAILED_PRECONDITION")) {
                            window.alert(
                              "아직 준비되지 않았습니다.\n음식이 준비되었다면 매장에 픽업 준비 처리를 요청해주세요.",
                            );
                            return;
                          } else if (message.includes("ALREADY_EXISTS")) {
                            window.alert("이미 픽업 처리 되었습니다.");
                            return;
                          }
                        }
                        throw e;
                      }
                    }}
                  >
                    픽업
                  </button>
                )}
                {action.type == DeliveryAction.Dropoff && (
                  <button
                    className="bg-green-500 disabled:bg-neutral-200 text-white px-4"
                    onClick={async () => {
                      await dropoff({
                        variables: { id: action.delivery.id },
                      });
                      await refetch();
                    }}
                    disabled={action.delivery.pickupTime == null}
                  >
                    배송
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <footer className="mt-4 p-2 text-sm">
          <h4 className="font-bold">알림</h4>
          <p>
            * 매장에서 주문을 <b>승인</b>했을 때 배차가 이루어집니다.
          </p>
          <p>
            * 현재 영업 중인 <b>무작위</b> 배달원에게 배차됩니다.
          </p>
          <p>* 매장에서 픽업 준비 버튼을 누른 이후 픽업이 가능합니다.</p>
          <p>* 배송 완료된 주문은 목록에서 삭제됩니다.</p>
        </footer>
      </section>
    </div>
  );
};

const ProfilePage = (): React.ReactElement => {
  const { isAuthenticated } = useAuth0();

  const courierId = useContext(courierContext);

  return (
    <>
      {!isAuthenticated && <p>로그인 후 이용하실 수 있습니다.</p>}
      {isAuthenticated && courierId != null && <UserSection id={courierId} />}
    </>
  );
};
export default ProfilePage;

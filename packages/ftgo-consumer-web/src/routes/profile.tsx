import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import consumerContext from "../context";

const GET_CONSUMER = gql(`
  query GetConsumer($id: ID!) {
    consumer(id: $id) {
      id
      name
      account {
        balance {
          amount
        }
      }
    }
  }
`);

const DEPOSIT = gql(`
  mutation DepositAccount($accountId: ID!) {
    depositAccount(accountId: $accountId, amount: { amount: "5000" }) {
      id
      balance {
        amount
      }
    }
  }
`);

const UserSection = ({ id }: { id: string }): React.ReactElement => {
  const { loading, error, data, refetch } = useQuery(GET_CONSUMER, {
    variables: { id },
  });

  const [deposit] = useMutation(DEPOSIT, { variables: { accountId: id } });

  if (error) {
    console.error(error);
    return <>Error</>;
  }
  if (loading || data == null) {
    return <>Loading</>;
  }

  return (
    <div className="p-2">
      <h3>마이페이지</h3>
      <p className="text-bold">{data.consumer.name}</p>
      <p>
        잔액: <span>{data.consumer.account.balance.amount}</span>원
      </p>
      <button
        className="bg-orange-500 text-white hover:bg-orange-600 px-4"
        onClick={async () => {
          await deposit();
          await refetch();
        }}
      >
        <span className="font-mono">5000</span>원 충전
      </button>
    </div>
  );
};

const ProfilePage = (): React.ReactElement => {
  const { isAuthenticated } = useAuth0();

  const consumerId = useContext(consumerContext);

  return (
    <>
      {!isAuthenticated && <p>로그인 후 이용하실 수 있습니다.</p>}
      {isAuthenticated && consumerId != null && <UserSection id={consumerId} />}
    </>
  );
};
export default ProfilePage;

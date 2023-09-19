import { useState } from "react";
import { gql } from "../../__generated__";
import { useMutation, useQuery } from "@apollo/client";

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

const CREATE_CONSUMER = gql(`
  mutation CreateConsumer($payload: ConsumerInfo!) {
    createConsumer(c: $payload) {
        id
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

const ConsumerInfo = ({ id }: { id: string }): React.ReactElement => {
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
    <div className="">
      <p className="text-bold">성명: {data.consumer.name}</p>
      <p>
        잔액: <span>{data.consumer.account.balance.amount}</span>원
      </p>
      <button
        className="bg-neutral-100 hover:bg-neutral-200 border px-4"
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

const CreateConsumer = ({
  onSubmit,
}: {
  onSubmit?(id: string): void;
}): React.ReactElement => {
  const [name, setName] = useState("");

  const [submit, { loading }] = useMutation(CREATE_CONSUMER);

  const handleSubmit = async () => {
    const result = await submit({
      variables: { payload: { name } },
    });
    if (result.data) {
      await sleep(1000);
      onSubmit?.(result.data.createConsumer.id);
    } else {
      alert("에러가 발생했습니다.");
    }

    setName("");
  };

  return (
    <div className="flex flex-col bg-violet-100 p-4">
      <h3 className="font-bold">고객 생성</h3>
      <div className="flex flex-col gap-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="성명"
          disabled={loading}
          required
        />
      </div>
      <button
        className="bg-neutral-100 hover:bg-neutral-200 border px-4 mt-8"
        onClick={handleSubmit}
        disabled={loading}
      >
        생성
      </button>
    </div>
  );
};

const CustomerSection = (): React.ReactElement => {
  const [id, setId] = useState("");

  return (
    <section className="flex flex-col gap-y-4">
      <div className="bg-orange-100 p-4">
        <h3 className="font-bold">고객조회</h3>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.currentTarget.value)}
          className="font-mono w-96"
          placeholder="고객 ID"
        />
        <div className="">{id && <ConsumerInfo id={id} />}</div>
      </div>

      <div className="">
        <CreateConsumer onSubmit={(id) => setId(id)} />
      </div>
    </section>
  );
};
export default CustomerSection;

const sleep = async (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

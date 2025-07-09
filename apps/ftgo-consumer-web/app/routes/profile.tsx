import { useMutation, useQuery } from "@tanstack/react-query";
import type { Route } from "./+types/profile";
import { consumers } from "@ftgo/util";
import { useAuth } from "~/lib/auth-context";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FTGO Consumer" },
    { name: "description", content: "FTGO Consumer" },
  ];
}

const ConsumerProfile = ({ id }: { id: string }) => {
  const consumerQuery = useQuery({
    queryKey: ["consumers", id],
    queryFn: () => consumers.get(id),
  });
  const accountQuery = useQuery({
    queryKey: ["consumers", id, "account"],
    queryFn: () => consumers.getAccount(id),
  });
  const depositMutation = useMutation({
    mutationFn: (amount: string) => consumers.deposit(id, { amount }),
  });

  return (
    <div className="p-4">
      <h1>My Profile</h1>
      <p className="text-bold">{consumerQuery.data?.name}</p>
      <p>
        Balance: <span>${accountQuery.data?.balance}</span>
      </p>
      <button
        type="button"
        className="bg-orange-500 text-white hover:bg-orange-600 px-4"
        onClick={async () => {
          await depositMutation.mutateAsync("5000");
          await accountQuery.refetch();
        }}
      >
        Top up <span className="font-mono">$5000</span>
      </button>
    </div>
  );
};

export default function Profile() {
  const { user } = useAuth();
  return (
    <>
      {user !== null && <ConsumerProfile id={user.consumerId} />}
      {user === null && (
        <div>
          <p>You should sign in to view your profile.</p>
          <Link
            to="/sign-in"
            className="text-blue-500 underline cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      )}
    </>
  );
}

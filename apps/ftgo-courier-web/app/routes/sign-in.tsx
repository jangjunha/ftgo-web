import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/sign-in";
import { useAuth } from "../lib/auth-context";
import { CourierLayout } from "~/components/CourierLayout";
import { defaultClient, delivery, users } from "@ftgo/util";
import { useMutation, useQuery } from "@tanstack/react-query";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In - FTGO Courier" },
    { name: "description", content: "Sign in to your FTGO account" },
  ];
}

type Stage = { stage: "login" } | { stage: "select-profile"; token: string };

const Login = ({ onSuccess }: { onSuccess?: (token: string) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const tokenResponse = await defaultClient.issueToken({
        grant_type: "password",
        username,
        password,
      });
      onSuccess?.(tokenResponse.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Or{" "}
        <Link
          to="/sign-up"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          create a new account
        </Link>
      </p>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
};

const SelectProfile = ({
  token,
  onSubmit,
}: {
  token: string;
  onSubmit?: (courierId: string) => void;
}) => {
  const meQuery = useQuery({
    queryKey: ["me-with-token"],
    queryFn: () => users.getCurrentUser(token),
    staleTime: 0,
    gcTime: 0,
  });
  const mutation = useMutation({
    mutationFn: () => delivery.createCourier(token),
    onSuccess: async ({ courier_id }) => {
      onSubmit?.(courier_id);
    },
  });
  useEffect(() => {
    if (meQuery.data?.granted_couriers.length === 0) {
      mutation.mutate();
    }
  }, [meQuery.data?.granted_couriers.length, mutation]);
  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Select a profile to continue
      </h2>
      <div className="mt-8">
        {meQuery.isLoading && <p>Loading...</p>}
        {meQuery.data && (
          <ul>
            {meQuery.data.granted_couriers.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  className="font-bold text-blue-500 font-mono cursor-pointer"
                  onClick={() => onSubmit?.(id)}
                >
                  {id}
                </button>
              </li>
            ))}
            {
              <li className="text-center">
                <button
                  type="button"
                  className="font-bold text-blue-500 cursor-pointer"
                  disabled={mutation.isPending}
                  onClick={async () => mutation.mutateAsync()}
                >
                  Create new profile
                </button>
              </li>
            }
          </ul>
        )}
      </div>
    </div>
  );
};

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [stage, setStage] = useState<Stage>({ stage: "login" });
  return (
    <CourierLayout>
      <div className="max-w-md mx-auto my-32 space-y-8">
        {stage.stage === "login" && (
          <Login
            onSuccess={(token) => setStage({ stage: "select-profile", token })}
          />
        )}
        {stage.stage === "select-profile" && (
          <SelectProfile
            token={stage.token}
            onSubmit={(courierId) => {
              login(courierId, stage.token);
              navigate("/");
            }}
          />
        )}
      </div>
    </CourierLayout>
  );
}

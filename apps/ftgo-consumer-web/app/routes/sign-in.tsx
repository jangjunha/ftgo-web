import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/sign-in";
import { useAuth } from "../lib/auth-context";
import { ConsumerLayout } from "~/components/ConsumerLayout";
import { consumers, defaultClient, users } from "@ftgo/util";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In - FTGO Consumer" },
    { name: "description", content: "Sign in to your FTGO account" },
  ];
}

type Stage =
  | { stage: "login" }
  | { stage: "select-profile"; token: string }
  | { stage: "create-profile"; token: string };

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
  onCreateNew,
}: {
  token: string;
  onSubmit?: (consumerId: string) => void;
  onCreateNew?: () => void;
}) => {
  const meQuery = useQuery({
    queryKey: ["me-with-token"],
    queryFn: () => users.getCurrentUser(token),
    staleTime: 0,
    gcTime: 0,
  });
  const consumerQueries = useQueries({
    queries:
      meQuery.data?.granted_consumers.map((id) => ({
        queryKey: ["consumers-with-token", id],
        queryFn: () => consumers.get(id, token),
      })) ?? [],
  });
  useEffect(() => {
    if (meQuery.data?.granted_consumers.length === 0) {
      onCreateNew?.();
    }
  }, [meQuery.data?.granted_consumers.length, onCreateNew]);
  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Select a profile to continue
      </h2>
      <div className="mt-8">
        {meQuery.isLoading && <p>Loading...</p>}
        {meQuery.data && (
          <ul>
            {consumerQueries.map((q, i) => {
              const id = meQuery.data.granted_consumers[i];
              return (
                <li key={id}>
                  <button
                    type="button"
                    className="font-bold text-blue-500 cursor-pointer"
                    onClick={() => onSubmit?.(id)}
                  >
                    {q.data === undefined && (
                      <p className="animate-pulse">Loading...</p>
                    )}
                    {q.data !== undefined && <p>{q.data.name}</p>}
                  </button>
                </li>
              );
            })}
            {onCreateNew && (
              <li className="text-center">
                <button
                  type="button"
                  className="font-bold text-blue-500 cursor-pointer"
                  onClick={onCreateNew}
                >
                  Create new profile
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

const CreateProfile = ({
  token,
  onSubmit,
}: {
  token: string;
  onSubmit?: (consumerId: string) => void;
}) => {
  const [name, setName] = useState("");
  const mutation = useMutation({
    mutationFn: (name: string) => consumers.create({ name }, token),
  });
  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create new profile
      </h2>
      <form
        className="mt-8 space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const { id } = await mutation.mutateAsync(name);
          onSubmit?.(id);
        }}
      >
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="username" className="sr-only">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {mutation.error && (
          <div className="text-red-600 text-sm">{mutation.error.message}</div>
        )}

        <div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [stage, setStage] = useState<Stage>({ stage: "login" });
  return (
    <ConsumerLayout>
      <div className="max-w-md mx-auto my-32 space-y-8">
        {stage.stage === "login" && (
          <Login
            onSuccess={(token) => setStage({ stage: "select-profile", token })}
          />
        )}
        {stage.stage === "select-profile" && (
          <SelectProfile
            token={stage.token}
            onSubmit={(consumerId) => {
              login(consumerId, stage.token);
              navigate("/");
            }}
            onCreateNew={() => {
              setStage({ stage: "create-profile", token: stage.token });
            }}
          />
        )}
        {stage.stage === "create-profile" && (
          <CreateProfile
            token={stage.token}
            onSubmit={(consumerId) => {
              login(consumerId, stage.token);
              navigate("/");
            }}
          />
        )}
      </div>
    </ConsumerLayout>
  );
}

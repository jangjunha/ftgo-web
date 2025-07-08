import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useAuth } from "../lib/auth-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FTGO Restaurant" },
    { name: "description", content: "FTGO Restaurant Management" },
  ];
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate("/restaurants");
      } else {
        navigate("/sign-in");
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return null;
}

import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/sign-out";
import { useAuth } from "../lib/auth-context";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Out - FTGO Consumer" },
    { name: "description", content: "Sign out from your FTGO account" },
  ];
}

export default function SignOut() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return <p>Logging out...</p>;
}

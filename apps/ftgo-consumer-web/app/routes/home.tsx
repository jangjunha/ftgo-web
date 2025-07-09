import { useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FTGO Consumer" },
    { name: "description", content: "FTGO Consumer" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/restaurants", { replace: true });
  }, [navigate]);

  return null;
}

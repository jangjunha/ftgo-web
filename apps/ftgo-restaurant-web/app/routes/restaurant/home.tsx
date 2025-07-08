import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("./tickets", { replace: true });
  }, [navigate]);
  return null;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = (): React.ReactElement => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/tickets/");
  }, []);
  return <></>;
};
export default IndexPage;

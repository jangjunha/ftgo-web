import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Authorized = (): React.ReactElement => {
  const { isAuthenticated, error, logout } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (error != null) {
    return (
      <>
        <p>로그인에 실패했습니다.</p>
        <p>
          소비자 혹은 배달원 계정으로 로그인 시도 시 실패할 수 있습니다. 매장
          계정으로 로그인해주세요.
        </p>
        <button
          onClick={() => logout()}
          className="px-2 bg-violet-500 text-white"
        >
          로그인 세션 초기화
        </button>
      </>
    );
  }

  return <p>Please wait...</p>;
};
export default Authorized;

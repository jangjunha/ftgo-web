import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Sidebar = (): React.ReactElement => {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  return (
    <>
      {!isAuthenticated && (
        <section className="flex flex-col">
          <div className="m-2 p-2 text-sm bg-blue-200 rounded-lg">
            <p className="font-bold">💡 테스트 계정</p>
            <p>
              Email: <span className="font-mono">consumer@example.com</span>
            </p>
            <p>
              Password: <span className="font-mono">test1234</span>
            </p>
          </div>
          <button
            onClick={() =>
              loginWithRedirect({
                authorizationParams: {
                  login_hint: "consumer@example.com",
                  max_age: 0,
                },
              })
            }
            className="bg-blue-500 text-white mx-2"
          >
            로그인
          </button>
          {/* <Link to="">회원가입</Link> */}
        </section>
      )}
      {isAuthenticated && user != null && (
        <section className="m-2 flex flex-col">
          <p>{user.email}</p>
          <button
            className="bg-blue-500 text-white mt-2"
            onClick={() => logout()}
          >
            로그아웃
          </button>
        </section>
      )}
      <div className="my-4">
        <h3 className="text-neutral-500 text-sm px-2">메뉴</h3>
        <ul className="flex flex-col divide-y [&_li]:flex [&_li]:flex-1 [&_li]:bg-neutral-100 [&_a]:flex-1 [&_a]:p-2">
          <li>
            <Link to="/">가게 목록</Link>
          </li>
          <li>
            <Link to="/orders/">주문 목록</Link>
          </li>
          <li>
            <Link to="/profile/">마이페이지</Link>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Sidebar;

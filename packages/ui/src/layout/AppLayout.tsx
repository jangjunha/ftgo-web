import { Link } from "react-router";

type Theme = "violet" | "orange" | "emerald";

const HEADER_BACKGROUND: Record<Theme, string> = {
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  emerald: "bg-emerald-500",
};

const SIDEBAR_BACKGROUND: Record<Theme, string> = {
  violet: "bg-violet-100",
  orange: "bg-orange-100",
  emerald: "bg-emerald-100",
};

const FOOTER_BACKGROUND: Record<Theme, string> = {
  violet: "bg-violet-200",
  orange: "bg-orange-200",
  emerald: "bg-emerald-200",
};

export const AppLayout = ({
  theme,
  username,
  title,
  sidebar,
  children,
}: {
  theme: Theme;
  username?: React.ReactNode;
  title: React.ReactNode;
  sidebar?: React.ReactNode;
  children?: React.ReactNode;
}): React.ReactElement => {
  return (
    <div className="min-h-screen container flex flex-col bg-white mx-auto max-w-4xl">
      <header
        className={`p-2 ${HEADER_BACKGROUND[theme]} flex items-center justify-between text-white`}
      >
        <h1 className="font-bold text-2xl">
          <Link to="/">{title}</Link>
        </h1>
        <div className="mx-2">
          {username !== undefined && (
            <div className="flex gap-4">
              <div>{username}</div>
              <Link to="/sign-out">로그아웃</Link>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex gap-0.5">
        {sidebar && (
          <div className={`w-64 ${SIDEBAR_BACKGROUND[theme]}`}>{sidebar}</div>
        )}
        <main className="flex-1">{children}</main>
      </div>

      <footer className={`${FOOTER_BACKGROUND[theme]} p-4`}>
        <ul className="flex justify-center gap-4 [&_a]:text-blue-500 [&_a]:underline">
          <li>
            <a
              href="https://github.com/jangjunha/ftgo-rust"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://restaurant.ftgo.jangjunha.me/"
              target="_blank"
              rel="noopener"
            >
              매장 웹
            </a>
          </li>
          <li>
            <a
              href="https://consumer.ftgo.jangjunha.me/"
              target="_blank"
              rel="noopener"
            >
              소비자 웹
            </a>
          </li>
          <li>
            <a
              href="https://courier.ftgo.jangjunha.me/"
              target="_blank"
              rel="noopener"
            >
              배달원 웹
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

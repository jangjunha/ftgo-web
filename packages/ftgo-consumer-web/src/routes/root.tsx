import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const Root = (): React.ReactElement => (
  <div className="container mx-auto max-w-2xl">
    <header className="p-2 bg-orange-500 text-white">
      <h1 className="font-bold text-2xl">
        <Link to="/">FTGO 소비자</Link>
      </h1>
    </header>
    <div className="flex gap-0.5">
      <div className="w-64 bg-orange-100">
        <Sidebar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
    <footer className="bg-neutral-200 p-4">
      <ul className="flex justify-center gap-4 [&_a]:text-blue-500 [&_a]:underline">
        <li>
          <a
            href="https://github.com/jangjunha/ftgo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
        <li>
          <a href="https://restaurant.ftgo.jangjunha.me/" target="_blank">
            매장 웹
          </a>
        </li>
        <li>
          <a href="https://courier.ftgo.jangjunha.me/" target="_blank">
            배달원 웹
          </a>
        </li>
      </ul>
    </footer>
  </div>
);
export default Root;

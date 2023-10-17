import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";

const Root = (): React.ReactElement => (
  <div className="container mx-auto max-w-2xl flex">
    <div className="w-64 bg-yellow-100">
      <Sidebar />
    </div>
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);
export default Root;

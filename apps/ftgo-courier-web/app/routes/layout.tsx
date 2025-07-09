import { NavLink, Outlet, type To } from "react-router";
import { CourierLayout } from "~/components/CourierLayout";

const MENU: {
  key: string;
  to: To;
  children?: React.ReactNode;
}[] = [
  {
    key: "home",
    to: "/",
    children: "Home",
  },
];

export default function Layout() {
  return (
    <CourierLayout
      sidebar={
        <div className="py-4 mb-4">
          <div className="mt-4">
            <p className="text-gray-500 font-bold text-sm mx-2 my-1">Menu</p>
            <ul className="flex flex-col divide-y divide-emerald-100 [&_li]:flex [&_li]:flex-1 [&_li]:bg-white [&_a]:flex-1 [&_a]:p-2">
              {MENU.map(({ key, to, children }) => (
                <li key={key}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [isActive && "bg-emerald-300"].join(" ")
                    }
                  >
                    {children}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    >
      <Outlet />
    </CourierLayout>
  );
}

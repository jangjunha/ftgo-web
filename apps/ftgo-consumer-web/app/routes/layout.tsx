import { NavLink, Outlet, type To } from "react-router";
import { ConsumerLayout } from "~/components/ConsumerLayout";

const MENU: {
  key: string;
  to: To;
  children?: React.ReactNode;
}[] = [
  {
    key: "restaurants",
    to: "/restaurants",
    children: "Browse Restaurants",
  },
  {
    key: "orders",
    to: "/orders",
    children: "My Orders",
  },
  {
    key: "profile",
    to: "/profile",
    children: "My Profile",
  },
];

export default function Layout() {
  return (
    <ConsumerLayout
      sidebar={
        <div className="py-4 mb-4">
          <div className="mt-4">
            <p className="text-gray-500 font-bold text-sm mx-2 my-1">Menu</p>
            <ul className="flex flex-col divide-y divide-orange-100 [&_li]:flex [&_li]:flex-1 [&_li]:bg-white [&_a]:flex-1 [&_a]:p-2">
              {MENU.map(({ key, to, children }) => (
                <li key={key}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      [isActive && "bg-orange-300"].join(" ")
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
    </ConsumerLayout>
  );
}

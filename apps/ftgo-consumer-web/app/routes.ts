import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-out", "routes/sign-out.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  layout("routes/layout.tsx", [
    ...prefix("restaurants", [
      route("", "routes/restaurants/home.tsx"),
      route(":restaurantId", "routes/restaurants/layout.tsx", [
        index("routes/restaurants/menu.tsx"),
      ]),
    ]),
    ...prefix("orders", [
      route("", "routes/orders.tsx"),
      route(":orderId", "routes/order_detail.tsx"),
    ]),
    route("profile", "routes/profile.tsx"),
  ]),
] satisfies RouteConfig;

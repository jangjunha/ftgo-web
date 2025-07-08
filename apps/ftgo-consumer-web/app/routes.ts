import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-out", "routes/sign-out.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("restaurants", "routes/restaurants.tsx"),
  route("restaurant/:restaurantId", "routes/restaurant/layout.tsx", [
    index("routes/restaurant/home.tsx"),
    route("cart", "routes/restaurant/cart.tsx"),
  ]),
] satisfies RouteConfig;

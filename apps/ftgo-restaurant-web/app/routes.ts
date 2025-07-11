import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-out", "routes/sign-out.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("restaurants", "routes/restaurants.tsx"),
  route("restaurants/create", "routes/restaurants/create.tsx"),
  route("restaurants/:restaurantId", "routes/restaurant.tsx", [
    index("routes/restaurant/home.tsx"),
    route("tickets", "routes/restaurant/tickets.tsx"),
    route("tickets/:ticketId", "routes/restaurant/ticket-detail.tsx"),
  ]),
] satisfies RouteConfig;

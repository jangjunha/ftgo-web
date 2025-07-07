import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("restaurants", "routes/restaurants.tsx"),
  route("restaurants/:restaurantId", "routes/restaurant.tsx", [
    index("routes/restaurant/tickets.tsx"),
    route("tickets/:ticketId", "routes/restaurant/ticket-detail.tsx"),
  ]),
] satisfies RouteConfig;

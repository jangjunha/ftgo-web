import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-out", "routes/sign-out.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  layout("routes/layout.tsx", [index("routes/home.tsx")]),
] satisfies RouteConfig;

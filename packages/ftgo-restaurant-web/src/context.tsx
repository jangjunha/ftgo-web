import { createContext } from "react";

const restaurantContext = createContext<string | null>(null);
export default restaurantContext;

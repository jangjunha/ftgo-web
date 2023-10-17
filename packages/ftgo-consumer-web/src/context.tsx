import { createContext } from "react";

const consumerContext = createContext<string | null>(null);
export default consumerContext;

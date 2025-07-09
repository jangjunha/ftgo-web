import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  define: {
    // Expose VITE_FTGO_API_URL to the browser
    __FTGO_API_URL__: JSON.stringify(process.env.VITE_FTGO_API_URL),
  },
});

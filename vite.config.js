import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vite from "@modyfi/vite-plugin-yaml";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vite()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // URL вашего целевого сервера
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

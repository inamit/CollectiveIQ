import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: "./ssl/client-key.pem",
      cert: "./ssl/client-cert.pem",
    },
  },
});

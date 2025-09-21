import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  define: {
    // Add this to handle React Router future flags
    global: 'globalThis',
  },
  resolve: {
    // Add this for better module resolution
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
});
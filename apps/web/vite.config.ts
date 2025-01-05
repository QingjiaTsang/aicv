import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    // Output the production build files to the API's public directory to allow the API server to serve both the API endpoints and static frontend dist assets
    outDir: "../api/public",
    // Clean the output directory before each build to ensure we don't have any old files from previous builds
    emptyOutDir: true,
  },
  plugins: [
    tsconfigPaths(),
    TanStackRouterVite({
      routeFilePrefix: "~",
      routeTreeFileHeader: [
        "/* eslint-disable eslint-comments/no-unlimited-disable */",
        "/* eslint-disable */",
      ],
      generatedRouteTree: "./src/route-tree.gen.ts",
    }),
    react(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
        timeout: 10000,
      },
    },
  },
});

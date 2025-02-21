import { SessionProvider } from "@hono/auth-js/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/web/components/providers/theme-provider";
import { Toaster } from "@/web/components/shadcn-ui/sonner"
import { StrictMode } from "react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { createRoot } from "react-dom/client";

import queryClient from "@/web/lib/query-client";

import App from "./app";

import "./lib/i18n";
import "./index.css";
import 'lenis/dist/lenis.css'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <App />
          <Toaster />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  </StrictMode>,
);

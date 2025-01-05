import type { SessionContext } from "@hono/auth-js/react";

import { getSession } from "@hono/auth-js/react";
import { createRootRouteWithContext, Outlet, useMatchRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import AppNavbar from "@/web/components/app-navbar";

type Session = Parameters<typeof SessionContext>[0]["value"];

export const Route = createRootRouteWithContext<{
  session: Session;
}>()({
  beforeLoad: async () => {
    const session = await getSession();

    return {
      session,
    };
  },
  component: RootLayout,
});

function RootLayout() {
  const hideNavRoutes: string[] = [];

  const matchRoute = useMatchRoute();

  const isHideNav = hideNavRoutes.some(route => matchRoute({ to: route }));

  return (
    <>
      {!isHideNav ? <AppNavbar /> : null}
      <main className="container mt-2 h-[calc(100dvh-6rem)]">
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </>
  );
};

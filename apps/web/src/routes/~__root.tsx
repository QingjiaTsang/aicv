import { getSession } from "@hono/auth-js/react";
import { createRootRouteWithContext, Outlet, useMatchRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import AppNavbar from "@/web/components/app-navbar";

type Session = Awaited<ReturnType<typeof getSession>>;

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
      <main className="mt-2 h-[calc(100dvh-6rem)] w-dvw">
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </>
  );
};

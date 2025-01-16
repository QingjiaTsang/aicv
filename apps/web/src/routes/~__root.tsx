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
    <div className="h-dvh w-dvw flex flex-col">
      {!isHideNav ? <AppNavbar /> : null}
      <main className="flex-1 pb-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
};

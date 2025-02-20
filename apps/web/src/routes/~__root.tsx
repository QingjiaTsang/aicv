import { getSession } from "@hono/auth-js/react";
import { createRootRouteWithContext, Outlet, useMatchRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import AppNavbar from "@/web/components/app-navbar";
import { ReactLenis } from "lenis/react";

import { ScrollRestoration } from '@tanstack/react-router'

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
  const hideNavRoutes: string[] = ['/preview/$documentId'];
  const matchRoute = useMatchRoute();
  const isHideNav = hideNavRoutes.some(route => matchRoute({ to: route }));

  return (
    <>
      <ScrollRestoration getKey={(location) => location.pathname} />
      <ReactLenis 
        root
        options={{
          // Note: add `data-lenis-stop` to the elements that should not be applied with lenis especially for modal, drawer, etc.
          prevent: (node) => {
            return node.dataset.lenisStop === 'true'
          }
        }}
      >
        <div className="min-h-dvh flex flex-col">
          {!isHideNav ? <AppNavbar /> : null}
          <main className="flex-1 mb-8">
            <Outlet />
          </main>
          {/* <TanStackRouterDevtools /> */}
        </div>
      </ReactLenis>
    </>
  );
}

import { getSession } from "@hono/auth-js/react";
import { createRootRouteWithContext, Outlet, useLocation, useMatchRoute, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useState, useEffect } from "react";
import { cn } from "@/web/lib/utils";

import AppNavbar from "@/web/components/app-navbar";
import { ReactLenis } from "lenis/react";


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

  const [isLenisReady, setIsLenisReady] = useState(false);
  useEffect(() => {
    // Make sure Lenis is ready
    setIsLenisReady(true);
  }, []);

  return (
    <ReactLenis root>
      <div className={cn(
        "min-h-dvh flex flex-col",
        "transition-opacity duration-300",
        !isLenisReady && "opacity-0",
        isLenisReady && "opacity-100"
      )}>
        {!isHideNav ? <AppNavbar /> : null}
        <main className="flex-1 pb-8">
          <Outlet />
        </main>
        {/* <TanStackRouterDevtools /> */}
      </div>
    </ReactLenis>
  );
}

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/web/route-tree.gen";
import { GlobalError } from "@/web/components/global-error";
import { GlobalNotFound } from "@/web/components/global-not-found";
import { GlobalPending } from "@/web/components/global-pending";

const router = createRouter({
  routeTree,
  context: {
    session: null,
  },
  defaultNotFoundComponent: () => <GlobalNotFound />,
  defaultErrorComponent: ({ error }) => <GlobalError error={error} />,
  defaultPendingComponent: () => <GlobalPending />,
  defaultPreload: "intent",
  defaultViewTransition: true,
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

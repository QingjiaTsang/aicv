import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "@/web/route-tree.gen";

const router = createRouter({
  routeTree,
  context: {
    session: undefined,
  },
  defaultNotFoundComponent: () => <div>global not found</div>,
  defaultErrorComponent: () => <div>global error</div>,
  defaultPendingComponent: () => <div>global pending</div>,
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

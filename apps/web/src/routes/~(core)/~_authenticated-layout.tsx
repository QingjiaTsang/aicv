import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(core)/_authenticated-layout")({
  beforeLoad: async ({ context, location }) => {
    if (!context.session?.user) {
      throw redirect({ to: "/sign-in", search: { callbackUrl: location.href } });
    }
  },
  component: () => {
    return <Outlet />;
  },
});

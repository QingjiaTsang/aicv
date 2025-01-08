import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing-layout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Hello "/(landing)/_landing-layout"!</h1>
      <Outlet />
    </div>
  );
}

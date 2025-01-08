import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(core)/_authenticated-layout/dashboard/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(core)/_authenticated-layout/dashboard/"!</div>;
}

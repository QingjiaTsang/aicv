import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing-layout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(landing)/_landing-layout/"! index</div>;
}

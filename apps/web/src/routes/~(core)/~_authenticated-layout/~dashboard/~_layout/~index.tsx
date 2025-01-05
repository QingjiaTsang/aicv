import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(core)/_authenticated-layout/dashboard/_layout/",
)({
  component: DashboardIndex,
});

function DashboardIndex() {
  return (
    <div>
      <h1>Dashboard Home</h1>
    </div>
  );
}

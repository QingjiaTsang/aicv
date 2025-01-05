import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(core)/_authenticated-layout/dashboard/_layout/analytics',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/dashboard/_dashboard/analytics"!</div>
}

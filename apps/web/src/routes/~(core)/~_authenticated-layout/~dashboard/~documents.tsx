import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(core)/_authenticated-layout/dashboard/documents',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(core)/_authenticated-layout/dashboard/documents"!</div>
}

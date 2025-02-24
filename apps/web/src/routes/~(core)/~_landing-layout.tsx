import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(core)/_landing-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

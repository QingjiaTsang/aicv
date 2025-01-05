import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(core)/_authenticated-layout/dashboard/_layout',
)({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
export default function DashboardSidebar() {
  return (
    <nav className="container">
      <ul className="justify-start">
        <li>
          <Link to="/dashboard">Dashboard Home</Link>
        </li>
        <li>
          <Link to="/dashboard/analytics">Analytics</Link>
        </li>
        <li>
          <Link to="/dashboard/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  )
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/preview/$documentId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/preview/[documentId]"!</div>
}

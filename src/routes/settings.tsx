import { createFileRoute } from '@tanstack/react-router'
import { createProtectedRoute } from '@/lib/protected-routes'

export const Route = createFileRoute('/settings')({
  ...createProtectedRoute(),
  component: Settings,
})

function Settings() {
  return (
    <div className="p-2">
      <h3>Settings</h3>
      <p>This page is protected.</p>
    </div>
  )
}

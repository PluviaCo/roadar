import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
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

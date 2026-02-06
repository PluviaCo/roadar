import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

function Settings() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [auth.isAuthenticated, navigate])

  if (!auth.isAuthenticated) {
    return null
  }

  return (
    <div className="p-2">
      <h3>Settings</h3>
      <p>This page is protected.</p>
      <p>Authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</p>
    </div>
  )
}

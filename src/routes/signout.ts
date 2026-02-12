import { createFileRoute } from '@tanstack/react-router'
import { logout } from '@/server/users'

export const Route = createFileRoute('/signout')({
  preload: false,
  loader: () => logout(),
})

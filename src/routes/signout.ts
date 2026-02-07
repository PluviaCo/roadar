import { createServerFn } from '@tanstack/react-start'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAppSession } from '@/lib/session'

const logoutFn = createServerFn().handler(async () => {
  const session = await useAppSession()

  session.clear()

  throw redirect({
    href: '/',
  })
})

export const Route = createFileRoute('/signout')({
  preload: false,
  loader: () => logoutFn(),
})

import { createServerFn } from '@tanstack/react-start'

export const fetchRoutes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getAllRoutes } = await import('@/db/routes')
    const { useAppSession } = await import('@/lib/session')

    const db = getDb((env as any).DB)
    const session = await useAppSession()
    const userId = session.data.id || undefined

    return await getAllRoutes(db, userId)
  },
)

export const fetchRoute = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getRouteById } = await import('@/db/routes')
    const { useAppSession } = await import('@/lib/session')

    const db = getDb((env as any).DB)
    const session = await useAppSession()
    const userId = session.data.id || undefined

    return await getRouteById(db, Number(data.id), userId)
  })

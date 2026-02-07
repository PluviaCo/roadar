import { createServerFn } from '@tanstack/react-start'

export const toggleSavedRoute = createServerFn({ method: 'POST' })
  .inputValidator((data: { routeId: string }) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { toggleSaved } = await import('@/db/saved-routes')
    const { useAppSession } = await import('@/lib/session')

    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    const userId = session.data.id
    const routeId = Number(data.routeId)

    const isSaved = await toggleSaved(db, userId, routeId)
    return { isSaved }
  })

export const fetchSavedRoutes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getSavedRoutes } = await import('@/db/saved-routes')
    const { useAppSession } = await import('@/lib/session')

    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    return await getSavedRoutes(db, session.data.id)
  },
)

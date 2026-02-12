import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { getDb } from '@/db'
import { toggleSaved, getSavedRoutes } from '@/db/saved-routes'
import { useAppSession } from '@/lib/session'

export const toggleSavedRoute = createServerFn({ method: 'POST' })
  .inputValidator((data: { routeId: string }) => data)
  .handler(async ({ data }) => {
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
    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    return await getSavedRoutes(db, session.data.id)
  },
)

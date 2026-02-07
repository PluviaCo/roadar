import { createServerFn } from '@tanstack/react-start'
import type { RouteCoordinate } from '@/db/routes'

export interface CreateRouteData {
  name: string
  description?: string
  coordinates: Array<RouteCoordinate>
  isPublic?: boolean
}

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

export const fetchUserRoutes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getUserRoutes } = await import('@/db/routes')
    const { useAppSession } = await import('@/lib/session')

    const session = await useAppSession()

    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    const routes = await getUserRoutes(db, session.data.id)

    return routes
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

export const createRoute = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateRouteData) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { createUserRoute } = await import('@/db/routes')
    const { useAppSession } = await import('@/lib/session')

    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    if (!data.name.trim()) {
      throw new Error('Route name is required')
    }

    if (data.coordinates.length < 2) {
      throw new Error('At least 2 coordinates are required for a route')
    }

    const db = getDb((env as any).DB)
    const routeId = await createUserRoute(db, session.data.id, {
      name: data.name.trim(),
      description: data.description?.trim(),
      coordinates: data.coordinates,
      isPublic: data.isPublic ?? true,
    })

    return { routeId }
  })

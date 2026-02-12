import { createServerFn } from '@tanstack/react-start'
import type { RouteCoordinate } from '@/db/routes'

export interface CreateRouteData {
  name: string
  description?: string
  coordinates: Array<RouteCoordinate>
  isPublic?: boolean
  prefectureId: number
}

export const fetchRoutes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getAllRoutes } = await import('@/db/routes')

    const db = getDb((env as any).DB)

    return await getAllRoutes(db, undefined)
  },
)

export const fetchPrefectures = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getAllPrefectures } = await import('@/db/prefectures')

    const db = getDb((env as any).DB)

    return await getAllPrefectures(db)
  },
)

export const fetchRoutesByPrefecture = createServerFn({ method: 'GET' })
  .inputValidator((data: { key: string }) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getAllPrefectures } = await import('@/db/prefectures')
    const { getRoutesByPrefecture } = await import('@/db/routes')

    const db = getDb((env as any).DB)

    // Find prefecture by key
    const prefectures = await getAllPrefectures(db)
    const prefecture = prefectures.find((p) => p.key === data.key)

    if (!prefecture) {
      throw new Error('Prefecture not found')
    }

    return {
      prefecture,
      routes: await getRoutesByPrefecture(db, prefecture.id),
    }
  })

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
    const { calculateRouteMetrics } = await import('@/lib/route-utils')

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

    // Calculate distance and duration using Google Maps API
    const apiKey = (env as any).GOOGLE_MAPS_API_KEY
    let distance: number | null = null
    let duration: number | null = null

    if (apiKey) {
      const metrics = await calculateRouteMetrics(data.coordinates, apiKey)
      if (metrics) {
        distance = metrics.distance
        duration = metrics.duration
      }
    }

    const db = getDb((env as any).DB)
    const routeId = await createUserRoute(db, session.data.id, {
      name: data.name.trim(),
      description: data.description?.trim(),
      coordinates: data.coordinates,
      isPublic: data.isPublic ?? true,
      distance,
      duration,
      prefectureId: data.prefectureId,
    })

    return { routeId }
  })

export const updateRoutePrivacy = createServerFn({ method: 'POST' })
  .inputValidator((data: { routeId: string; isPublic: boolean }) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { updateRoutePrivacy: updateRoutePrivacyDb } =
      await import('@/db/routes')
    const { useAppSession } = await import('@/lib/session')

    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    await updateRoutePrivacyDb(
      db,
      Number(data.routeId),
      session.data.id,
      data.isPublic,
    )

    return { success: true }
  })

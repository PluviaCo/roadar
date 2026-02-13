import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import type { RouteCoordinate } from '@/db/routes'
import {
  createUserRoute,
  getAllRoutes,
  getRouteById,
  getRoutesByPrefecture,
  getRoutesByRegion,
  getUserRoutes,
  updateRoutePrivacy as updateRoutePrivacyDb,
} from '@/db/routes'
import { getAllPrefectures } from '@/db/prefectures'
import { getAllRegions, getRegionByKey } from '@/db/regions'
import { useAppSession } from '@/lib/session'
import { calculateRouteMetrics } from '@/lib/route-utils'
import { getDb } from '@/db'

export interface CreateRouteData {
  name: string
  description?: string
  coordinates: Array<RouteCoordinate>
  isPublic?: boolean
  prefectureId: number
}

export const fetchRoutes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb((env as any).DB)

    return await getAllRoutes(db, undefined)
  },
)

export const fetchRoutesByPrefecture = createServerFn({ method: 'GET' })
  .inputValidator((data: { key: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb((env as any).DB)

    // Find prefecture by key
    const prefectures = await getAllPrefectures(db)
    const prefecture = prefectures.find((p) => p.key === data.key)

    if (!prefecture) {
      throw new Error('Prefecture not found')
    }

    // Get the region for this prefecture
    const allRegions = await getAllRegions(db)
    const region = allRegions.find((r) => r.id === prefecture.region_id)

    return {
      prefecture,
      region,
      routes: await getRoutesByPrefecture(db, prefecture.id),
    }
  })

export const fetchRoutesByRegion = createServerFn({ method: 'GET' })
  .inputValidator((data: { key: string }) => data)
  .handler(async ({ data }) => {
    const db = getDb((env as any).DB)

    // Find region by key
    const region = await getRegionByKey(db, data.key)

    if (!region) {
      throw new Error('Region not found')
    }

    return {
      region,
      routes: await getRoutesByRegion(db, region.id),
    }
  })

export const fetchUserRoutes = createServerFn({ method: 'GET' }).handler(
  async () => {
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
    const db = getDb((env as any).DB)
    const session = await useAppSession()
    const userId = session.data.id || undefined

    return await getRouteById(db, Number(data.id), userId)
  })

export const createRoute = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateRouteData) => data)
  .handler(async ({ data }) => {
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

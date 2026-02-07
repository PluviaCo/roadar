import type { Kysely } from 'kysely'
import type { DB } from './types'

export interface RouteCoordinate {
  lat: number
  lng: number
}

export interface Route {
  id: string
  name: string
  coordinates: Array<RouteCoordinate>
  photos: Array<string>
  isSaved?: boolean
}

// Database functions
export async function createRoute(
  db: Kysely<DB>,
  name: string,
  coordinates: Array<RouteCoordinate>,
  photoUrls: Array<string>,
): Promise<number> {
  // Insert route
  const result = await db
    .insertInto('routes')
    .values({
      name,
      coordinates: JSON.stringify(coordinates),
    })
    .executeTakeFirstOrThrow()

  const routeId = Number(result.insertId)

  // Insert photos if any
  if (photoUrls.length > 0) {
    await db
      .insertInto('photos')
      .values(
        photoUrls.map((url) => ({
          route_id: routeId,
          url,
        })),
      )
      .execute()
  }

  return routeId
}

export async function getAllRoutes(
  db: Kysely<DB>,
  userId?: number,
): Promise<Array<Route>> {
  const routes = await db
    .selectFrom('routes')
    .selectAll()
    .orderBy('created_at', 'desc')
    .execute()

  // Get saved route IDs if user is logged in
  let savedIds: Set<number> = new Set()
  if (userId) {
    const savedRoutes = await db
      .selectFrom('saved_routes')
      .select('route_id')
      .where('user_id', '=', userId)
      .execute()
    savedIds = new Set(savedRoutes.map((f) => f.route_id))
  }

  const routesWithPhotos = await Promise.all(
    routes.map(async (route) => {
      const photos = await db
        .selectFrom('photos')
        .select('url')
        .where('route_id', '=', route.id)
        .orderBy('created_at', 'asc')
        .execute()

      return {
        id: String(route.id),
        name: route.name,
        coordinates: JSON.parse(route.coordinates) as Array<RouteCoordinate>,
        photos: photos.map((p) => p.url),
        isSaved: userId ? savedIds.has(route.id) : undefined,
      }
    }),
  )

  return routesWithPhotos
}

export async function getRouteById(
  db: Kysely<DB>,
  id: number,
  userId?: number,
): Promise<Route | undefined> {
  const route = await db
    .selectFrom('routes')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!route) {
    return undefined
  }

  const photos = await db
    .selectFrom('photos')
    .select('url')
    .where('route_id', '=', route.id)
    .orderBy('created_at', 'asc')
    .execute()

  let isSaved: boolean | undefined = undefined
  if (userId) {
    const savedRoute = await db
      .selectFrom('saved_routes')
      .select('id')
      .where('user_id', '=', userId)
      .where('route_id', '=', route.id)
      .executeTakeFirst()
    isSaved = !!savedRoute
  }

  return {
    id: String(route.id),
    name: route.name,
    coordinates: JSON.parse(route.coordinates) as Array<RouteCoordinate>,
    photos: photos.map((p) => p.url),
    isSaved,
  }
}

export async function deleteRoute(db: Kysely<DB>, id: number): Promise<void> {
  // Photos will be deleted automatically due to CASCADE
  await db.deleteFrom('routes').where('id', '=', id).execute()
}

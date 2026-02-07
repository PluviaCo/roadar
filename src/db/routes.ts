import type { Kysely } from 'kysely'
import type { DB } from './types'

export interface RouteCoordinate {
  lat: number
  lng: number
}

export interface Route {
  id: string
  name: string
  description: string | null
  coordinates: Array<RouteCoordinate>
  photos: Array<string>
  tripCount: number
  averageRating: number | null
  isSaved?: boolean
  userId?: number | null
  isPublic?: boolean
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
      is_public: true,
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

// Create a user-created route
export async function createUserRoute(
  db: Kysely<DB>,
  userId: number,
  data: {
    name: string
    description?: string
    coordinates: Array<RouteCoordinate>
    isPublic?: boolean
  },
): Promise<number> {
  const result = await db
    .insertInto('routes')
    .values({
      name: data.name,
      description: data.description || null,
      coordinates: JSON.stringify(data.coordinates),
      user_id: userId,
      is_public: data.isPublic ?? true,
    })
    .executeTakeFirstOrThrow()

  return Number(result.insertId)
}

export async function getAllRoutes(
  db: Kysely<DB>,
  userId?: number,
): Promise<Array<Route>> {
  // Get routes that are either public OR owned by the user
  let query = db.selectFrom('routes').selectAll().orderBy('created_at', 'desc')

  if (userId) {
    // Show public routes + user's own routes (public or private)
    query = query.where((eb) =>
      eb.or([eb('is_public', '=', true), eb('user_id', '=', userId)]),
    )
  } else {
    // Show only public routes for non-authenticated users
    query = query.where('is_public', '=', true)
  }

  const routes = await query.execute()

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
      // Get direct route photos
      const photos = await db
        .selectFrom('photos')
        .select('url')
        .where('route_id', '=', route.id)
        .orderBy('created_at', 'asc')
        .execute()

      // Get trip photos from trips on this route
      const tripPhotos = await db
        .selectFrom('trip_photos')
        .innerJoin('trips', 'trips.id', 'trip_photos.trip_id')
        .select('trip_photos.url')
        .where('trips.route_id', '=', route.id)
        .orderBy('trip_photos.created_at', 'asc')
        .execute()

      // Get trip count and average rating
      const tripStats = await db
        .selectFrom('trips')
        .select([
          db.fn.count('id').as('count'),
          db.fn.avg('rating').as('avg_rating'),
        ])
        .where('route_id', '=', route.id)
        .executeTakeFirst()

      const allPhotos = [
        ...photos.map((p) => p.url),
        ...tripPhotos.map((p) => p.url),
      ]

      return {
        id: String(route.id),
        name: route.name,
        description: route.description,
        coordinates: JSON.parse(route.coordinates) as Array<RouteCoordinate>,
        photos: allPhotos,
        tripCount: Number(tripStats?.count || 0),
        averageRating: tripStats?.avg_rating
          ? Number(tripStats.avg_rating)
          : null,
        isSaved: userId ? savedIds.has(route.id) : undefined,
        userId: route.user_id,
        isPublic: route.is_public,
      }
    }),
  )

  return routesWithPhotos
}

// Get routes created by a specific user
export async function getUserRoutes(
  db: Kysely<DB>,
  userId: number,
): Promise<Array<Route>> {
  const routes = await db
    .selectFrom('routes')
    .selectAll()
    .where('user_id', '=', userId)
    .orderBy('created_at', 'desc')
    .execute()

  // Get saved route IDs
  const savedRoutes = await db
    .selectFrom('saved_routes')
    .select('route_id')
    .where('user_id', '=', userId)
    .execute()
  const savedIds = new Set(savedRoutes.map((f) => f.route_id))

  const routesWithPhotos = await Promise.all(
    routes.map(async (route) => {
      // Get direct route photos
      const photos = await db
        .selectFrom('photos')
        .select('url')
        .where('route_id', '=', route.id)
        .orderBy('created_at', 'asc')
        .execute()

      // Get trip photos from trips on this route
      const tripPhotos = await db
        .selectFrom('trip_photos')
        .innerJoin('trips', 'trips.id', 'trip_photos.trip_id')
        .select('trip_photos.url')
        .where('trips.route_id', '=', route.id)
        .orderBy('trip_photos.created_at', 'asc')
        .execute()

      // Get trip count and average rating
      const tripStats = await db
        .selectFrom('trips')
        .select([
          db.fn.count('id').as('count'),
          db.fn.avg('rating').as('avg_rating'),
        ])
        .where('route_id', '=', route.id)
        .executeTakeFirst()

      const allPhotos = [
        ...photos.map((p) => p.url),
        ...tripPhotos.map((p) => p.url),
      ]

      return {
        id: String(route.id),
        name: route.name,
        description: route.description,
        coordinates: JSON.parse(route.coordinates) as Array<RouteCoordinate>,
        photos: allPhotos,
        tripCount: Number(tripStats?.count || 0),
        averageRating: tripStats?.avg_rating
          ? Number(tripStats.avg_rating)
          : null,
        isSaved: savedIds.has(route.id),
        userId: route.user_id,
        isPublic: route.is_public,
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

  // Get direct route photos
  const photos = await db
    .selectFrom('photos')
    .select('url')
    .where('route_id', '=', route.id)
    .orderBy('created_at', 'asc')
    .execute()

  // Get trip photos from trips on this route
  const tripPhotos = await db
    .selectFrom('trip_photos')
    .innerJoin('trips', 'trips.id', 'trip_photos.trip_id')
    .select('trip_photos.url')
    .where('trips.route_id', '=', route.id)
    .orderBy('trip_photos.created_at', 'asc')
    .execute()

  // Get trip count and average rating
  const tripStats = await db
    .selectFrom('trips')
    .select([
      db.fn.count('id').as('count'),
      db.fn.avg('rating').as('avg_rating'),
    ])
    .where('route_id', '=', route.id)
    .executeTakeFirst()

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

  const allPhotos = [
    ...photos.map((p) => p.url),
    ...tripPhotos.map((p) => p.url),
  ]

  return {
    id: String(route.id),
    name: route.name,
    description: route.description,
    coordinates: JSON.parse(route.coordinates) as Array<RouteCoordinate>,
    photos: allPhotos,
    tripCount: Number(tripStats?.count || 0),
    averageRating: tripStats?.avg_rating ? Number(tripStats.avg_rating) : null,
    isSaved,
    userId: route.user_id,
    isPublic: route.is_public,
  }
}

export async function deleteRoute(db: Kysely<DB>, id: number): Promise<void> {
  // Photos will be deleted automatically due to CASCADE
  await db.deleteFrom('routes').where('id', '=', id).execute()
}

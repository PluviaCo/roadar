import type { Kysely } from 'kysely'
import type { DB } from './types'
import type { RouteCoordinate } from './routes'

export interface Trip {
  id: string
  userId: string
  routeId: string | null
  title: string
  notes: string | null
  coordinates: Array<RouteCoordinate>
  date: string
  rating: number | null
  photos: Array<string>
  likeCount: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTripInput {
  userId: number
  routeId: number | null
  title: string
  notes: string | null
  coordinates: Array<RouteCoordinate>
  date: string
  rating: number | null
  photoUrls: Array<string>
}

// Create a new trip
export async function createTrip(
  db: Kysely<DB>,
  input: CreateTripInput,
): Promise<number> {
  const result = await db
    .insertInto('trips')
    .values({
      user_id: input.userId,
      route_id: input.routeId,
      title: input.title,
      notes: input.notes,
      coordinates: JSON.stringify(input.coordinates),
      date: input.date,
      rating: input.rating,
    })
    .executeTakeFirstOrThrow()

  const tripId = Number(result.insertId)

  // Insert photos if any
  if (input.photoUrls.length > 0) {
    await db
      .insertInto('trip_photos')
      .values(
        input.photoUrls.map((url) => ({
          trip_id: tripId,
          url,
        })),
      )
      .execute()
  }

  return tripId
}

// Get trips for a specific route
export async function getTripsByRouteId(
  db: Kysely<DB>,
  routeId: number,
  userId?: number,
): Promise<Array<Trip>> {
  const trips = await db
    .selectFrom('trips')
    .selectAll()
    .where('route_id', '=', routeId)
    .orderBy('date', 'desc')
    .execute()

  return await enrichTrips(db, trips, userId)
}

// Get trips by a specific user
export async function getTripsByUserId(
  db: Kysely<DB>,
  userId: number,
  viewerUserId?: number,
): Promise<Array<Trip>> {
  const trips = await db
    .selectFrom('trips')
    .selectAll()
    .where('user_id', '=', userId)
    .orderBy('date', 'desc')
    .execute()

  return await enrichTrips(db, trips, viewerUserId)
}

// Get a single trip by ID
export async function getTripById(
  db: Kysely<DB>,
  id: number,
  userId?: number,
): Promise<Trip | undefined> {
  const trip = await db
    .selectFrom('trips')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!trip) return undefined

  const enriched = await enrichTrips(db, [trip], userId)
  return enriched[0]
}

// Toggle like on a trip
export async function toggleTripLike(
  db: Kysely<DB>,
  userId: number,
  tripId: number,
): Promise<void> {
  const existing = await db
    .selectFrom('trip_likes')
    .selectAll()
    .where('user_id', '=', userId)
    .where('trip_id', '=', tripId)
    .executeTakeFirst()

  if (existing) {
    await db
      .deleteFrom('trip_likes')
      .where('user_id', '=', userId)
      .where('trip_id', '=', tripId)
      .execute()
  } else {
    await db
      .insertInto('trip_likes')
      .values({
        user_id: userId,
        trip_id: tripId,
      })
      .execute()
  }
}

// Helper to enrich trips with photos and likes
async function enrichTrips(
  db: Kysely<DB>,
  trips: Array<any>,
  userId?: number,
): Promise<Array<Trip>> {
  if (trips.length === 0) return []

  const tripIds = trips.map((t) => t.id)

  // Get all photos for these trips
  const photos = await db
    .selectFrom('trip_photos')
    .select(['trip_id', 'url'])
    .where('trip_id', 'in', tripIds)
    .orderBy('created_at', 'asc')
    .execute()

  const photosByTripId = photos.reduce(
    (acc, photo) => {
      if (!acc[photo.trip_id]) acc[photo.trip_id] = []
      acc[photo.trip_id].push(photo.url)
      return acc
    },
    {} as Record<number, Array<string>>,
  )

  // Get like counts for these trips
  const likeCounts = await db
    .selectFrom('trip_likes')
    .select(['trip_id', db.fn.count('id').as('count')])
    .where('trip_id', 'in', tripIds)
    .groupBy('trip_id')
    .execute()

  const likeCountByTripId = likeCounts.reduce(
    (acc, like) => {
      acc[like.trip_id] = Number(like.count)
      return acc
    },
    {} as Record<number, number>,
  )

  // Get user's liked trips if logged in
  let likedTripIds: Set<number> = new Set()
  if (userId) {
    const liked = await db
      .selectFrom('trip_likes')
      .select('trip_id')
      .where('user_id', '=', userId)
      .where('trip_id', 'in', tripIds)
      .execute()
    likedTripIds = new Set(liked.map((l) => l.trip_id))
  }

  return trips.map((trip) => ({
    id: String(trip.id),
    userId: String(trip.user_id),
    routeId: trip.route_id ? String(trip.route_id) : null,
    title: trip.title,
    notes: trip.notes,
    coordinates: JSON.parse(trip.coordinates) as Array<RouteCoordinate>,
    date: new Date(trip.date).toISOString(),
    rating: trip.rating,
    photos: photosByTripId[trip.id] || [],
    likeCount: likeCountByTripId[trip.id] || 0,
    isLiked: userId ? likedTripIds.has(trip.id) : undefined,
    createdAt: new Date(trip.created_at).toISOString(),
    updatedAt: new Date(trip.updated_at).toISOString(),
  }))
}

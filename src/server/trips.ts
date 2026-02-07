import { createServerFn } from '@tanstack/react-start'

export interface CreateTripData {
  routeId: string | null
  title: string
  notes: string | null
  coordinates: Array<{ lat: number; lng: number }>
  date: string
  rating: number | null // 1-5 stars
  photos: Array<Array<number>> // File as number array for serialization
}

export const createTrip = createServerFn({ method: 'POST' })
  .inputValidator((data: { data: CreateTripData }) => data)
  .handler(async ({ data: { data } }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { createTrip: dbCreateTrip } = await import('@/db/trips')
    const { useAppSession } = await import('@/lib/session')

    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    const photoUrls: Array<string> = []

    // Upload photos to R2 if any
    if (data.photos && data.photos.length > 0) {
      const bucket = (env as any).PHOTOS_BUCKET
      if (!bucket) {
        throw new Error('Photo storage not configured')
      }

      for (const photoData of data.photos) {
        const timestamp = Date.now()
        const filename = `trips/${session.data.id}_${timestamp}.jpg`
        const key = filename

        const buffer = new Uint8Array(photoData)
        await bucket.put(key, buffer, {
          httpMetadata: {
            contentType: 'image/jpeg',
          },
        })

        photoUrls.push(`/photos/${key}`)
      }
    }

    const tripId = await dbCreateTrip(db, {
      userId: session.data.id,
      routeId: data.routeId ? Number(data.routeId) : null,
      title: data.title,
      notes: data.notes,
      coordinates: data.coordinates,
      date: new Date(data.date),
      rating: data.rating,
      photoUrls,
    })

    return { id: tripId }
  })

export const fetchTripsByRoute = createServerFn({ method: 'GET' })
  .inputValidator((data: { routeId: string }) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getTripsByRouteId } = await import('@/db/trips')
    const { useAppSession } = await import('@/lib/session')

    const db = getDb((env as any).DB)
    const session = await useAppSession()
    const userId = session.data.id || undefined

    return await getTripsByRouteId(db, Number(data.routeId), userId)
  })

export const fetchTripsByUser = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getTripsByUserId } = await import('@/db/trips')
    const { useAppSession } = await import('@/lib/session')

    const db = getDb((env as any).DB)
    const session = await useAppSession()
    const viewerUserId = session.data.id || undefined

    return await getTripsByUserId(db, Number(data.userId), viewerUserId)
  })

export const fetchTrip = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { getTripById } = await import('@/db/trips')
    const { useAppSession } = await import('@/lib/session')

    const db = getDb((env as any).DB)
    const session = await useAppSession()
    const userId = session.data.id || undefined

    return await getTripById(db, Number(data.id), userId)
  })

export const toggleTripLike = createServerFn({ method: 'POST' })
  .inputValidator((data: { data: { tripId: string } }) => data)
  .handler(async ({ data: { data } }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { toggleTripLike: dbToggleTripLike } = await import('@/db/trips')
    const { useAppSession } = await import('@/lib/session')

    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    await dbToggleTripLike(db, session.data.id, Number(data.tripId))

    return { success: true }
  })

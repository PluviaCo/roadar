import type { RouteCoordinate } from '@/db/routes'

interface RoutesApiLeg {
  distanceMeters: number
  duration: string // ISO 8601 duration string (e.g., "1234s")
}

interface RoutesApiRoute {
  legs: Array<RoutesApiLeg>
  distanceMeters: number
  duration: string
}

interface RoutesApiResponse {
  routes?: Array<RoutesApiRoute>
}

/**
 * Calculate route distance and duration using Google Maps Routes API v2
 * Returns accurate driving distance (meters) and duration (seconds) based on real roads
 */
export async function calculateRouteMetrics(
  coordinates: Array<RouteCoordinate>,
  apiKey: string,
): Promise<{ distance: number; duration: number } | null> {
  if (coordinates.length < 2) return null

  const origin = {
    location: {
      latLng: {
        latitude: coordinates[0].lat,
        longitude: coordinates[0].lng,
      },
    },
  }

  const destination = {
    location: {
      latLng: {
        latitude: coordinates[coordinates.length - 1].lat,
        longitude: coordinates[coordinates.length - 1].lng,
      },
    },
  }

  const intermediates =
    coordinates.length > 2
      ? coordinates.slice(1, -1).map((coord) => ({
          location: {
            latLng: {
              latitude: coord.lat,
              longitude: coord.lng,
            },
          },
        }))
      : undefined

  const requestBody = {
    origin,
    destination,
    intermediates,
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE',
  }

  try {
    const response = await fetch(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
        },
        body: JSON.stringify(requestBody),
      },
    )

    if (!response.ok) {
      console.error('Google Maps API request failed:', response.statusText)
      return null
    }

    const data: RoutesApiResponse = await response.json()

    if (!data.routes || data.routes.length === 0) {
      console.error('Google Maps API returned no routes')
      return null
    }

    const route = data.routes[0]

    // Parse ISO 8601 duration string (e.g., "1234s" -> 1234)
    const durationSeconds = parseInt(route.duration.replace('s', ''))

    return {
      distance: route.distanceMeters,
      duration: durationSeconds,
    }
  } catch (error) {
    console.error('Error calling Google Maps Routes API:', error)
    return null
  }
}

/**
 * Format distance for display (converts meters to km when appropriate)
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`
  }
  return `${(distanceMeters / 1000).toFixed(1)} km`
}

/**
 * Format duration for display (converts seconds to hours/minutes)
 */
export function formatDuration(durationSeconds: number): string {
  const hours = Math.floor(durationSeconds / 3600)
  const minutes = Math.floor((durationSeconds % 3600) / 60)

  if (hours === 0) {
    return `${minutes} min`
  }

  if (minutes === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${minutes} min`
}

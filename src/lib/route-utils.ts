import type { RouteCoordinate } from '@/db/routes'

interface GoogleMapsDirectionsLeg {
  distance: { value: number } // meters
  duration: { value: number } // seconds
}

interface GoogleMapsDirectionsRoute {
  legs: Array<GoogleMapsDirectionsLeg>
}

interface GoogleMapsDirectionsResponse {
  status: string
  routes?: Array<GoogleMapsDirectionsRoute>
}

/**
 * Calculate route distance and duration using Google Maps Directions API
 * Returns accurate driving distance (meters) and duration (seconds) based on real roads
 */
export async function calculateRouteMetrics(
  coordinates: Array<RouteCoordinate>,
  apiKey: string,
): Promise<{ distance: number; duration: number } | null> {
  if (coordinates.length < 2) return null

  const origin = `${coordinates[0].lat},${coordinates[0].lng}`
  const destination = `${coordinates[coordinates.length - 1].lat},${coordinates[coordinates.length - 1].lng}`

  // Build waypoints string for middle points
  const waypoints =
    coordinates.length > 2
      ? coordinates
          .slice(1, -1)
          .map((coord) => `${coord.lat},${coord.lng}`)
          .join('|')
      : ''

  const params = new URLSearchParams({
    origin,
    destination,
    key: apiKey,
    mode: 'driving',
  })

  if (waypoints) {
    params.append('waypoints', waypoints)
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`,
    )

    if (!response.ok) {
      console.error('Google Maps API request failed:', response.statusText)
      return null
    }

    const data: GoogleMapsDirectionsResponse = await response.json()

    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      console.error('Google Maps API returned no routes:', data.status)
      return null
    }

    const route = data.routes[0]
    let totalDistanceMeters = 0
    let totalDurationSeconds = 0

    // Sum up all legs
    for (const leg of route.legs) {
      totalDistanceMeters += leg.distance.value
      totalDurationSeconds += leg.duration.value
    }

    return {
      distance: Math.round(totalDistanceMeters),
      duration: totalDurationSeconds,
    }
  } catch (error) {
    console.error('Error calling Google Maps Directions API:', error)
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
  const minutes = Math.round(durationSeconds / 60)
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

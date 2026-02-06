import { useEffect, useState } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'

const RoutePlotter = ({
  points,
}: {
  points: Array<google.maps.LatLngLiteral>
}) => {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null)

  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    if (!routesLibrary || !map) return

    setDirectionsService(new routesLibrary.DirectionsService())
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        polylineOptions: {
          strokeColor: '#FBBC04',
          strokeWeight: 6,
          strokeOpacity: 0.9,
        },
      }),
    )
  }, [routesLibrary, map])

  // 2. Run the calculation whenever 'points' changes
  useEffect(() => {
    if (!directionsService || !directionsRenderer || points.length < 2) return

    const origin = points[0]
    const destination = points[points.length - 1]

    // Middle points (X, Y, Z)
    const waypoints = points.slice(1, -1).map((p) => ({
      location: p,
      stopover: true,
    }))

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result)
        } else {
          console.error('Directions request failed due to ' + status)
        }
      },
    )
  }, [directionsService, directionsRenderer, points])

  return null
}

export default RoutePlotter

import { Box } from '@mui/material'
import {
  APIProvider,
  AdvancedMarker,
  CollisionBehavior,
  Map,
} from '@vis.gl/react-google-maps'
import { useState } from 'react'
import { MapRouteCard } from './MapRouteCard'
import type { Route } from '@/db/routes'

interface RoutesMapProps {
  routes: Array<Route>
  savedRoutes: Record<string, boolean>
  user: any
  onSaveClick: (e: React.MouseEvent, routeId: string) => void
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

export function RoutesMap({
  routes,
  savedRoutes,
  user,
  onSaveClick,
}: RoutesMapProps) {
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

  const Z_INDEX_SELECTED = routes.length
  const Z_INDEX_HOVER = routes.length + 1

  // Calculate center of all routes
  const getMapCenter = () => {
    if (routes.length === 0) {
      return { lat: 35.6762, lng: 139.6503 } // Tokyo as default
    }

    const allCoordinates = routes.flatMap((route) => route.coordinates)
    if (allCoordinates.length === 0) {
      return { lat: 35.6762, lng: 139.6503 }
    }

    const avgLat =
      allCoordinates.reduce((sum, coord) => sum + coord.lat, 0) /
      allCoordinates.length
    const avgLng =
      allCoordinates.reduce((sum, coord) => sum + coord.lng, 0) /
      allCoordinates.length

    return { lat: avgLat, lng: avgLng }
  }

  const mapCenter = getMapCenter()

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
        Google Maps API key is not configured
      </Box>
    )
  }

  if (!GOOGLE_MAPS_MAP_ID) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', color: 'warning.main' }}>
        Google Maps Map ID is not configured - Advanced Markers won't display
      </Box>
    )
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          pointerEvents: 'auto',
        }}
      >
        <Map
          defaultZoom={12}
          defaultCenter={mapCenter}
          gestureHandling="auto"
          disableDefaultUI={false}
          mapId={GOOGLE_MAPS_MAP_ID}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {routes
            .map((route, index) => ({ route, index }))
            .sort((a, b) => {
              const latA = a.route.coordinates[0]?.lat ?? 0
              const latB = b.route.coordinates[0]?.lat ?? 0
              return latB - latA // South (lower lat) appears on top
            })
            .map(({ route, index: zIndexDefault }) => {
              const markerPosition = route.coordinates[0]
              const isSelected = selectedRouteId === route.id
              const isHovered = hoveredRouteId === route.id
              const showCard = isSelected || isHovered

              // Higher z-index when selected or hovered
              let zIndex = zIndexDefault

              if (isHovered) {
                zIndex = Z_INDEX_HOVER
              }

              if (isSelected) {
                zIndex = Z_INDEX_SELECTED
              }

              return (
                <AdvancedMarker
                  key={route.id}
                  position={markerPosition}
                  title={route.name}
                  zIndex={zIndex}
                  collisionBehavior={
                    CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY
                  }
                  onMouseEnter={() => setHoveredRouteId(route.id)}
                  onMouseLeave={() => {
                    if (!isSelected) {
                      setHoveredRouteId(null)
                    }
                  }}
                  onClick={() =>
                    setSelectedRouteId(isSelected ? null : route.id)
                  }
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {/* Info card above the pin */}
                    {showCard && (
                      <Box
                        sx={{
                          pointerEvents: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setHoveredRouteId(route.id)}
                        onMouseLeave={() => {
                          if (!isSelected) {
                            setHoveredRouteId(null)
                          }
                        }}
                      >
                        <MapRouteCard
                          route={route}
                          isSaved={savedRoutes[route.id] || false}
                          showSaveButton={!!user}
                          onSaveClick={onSaveClick}
                        />
                      </Box>
                    )}

                    {/* Pin marker - circle with white center */}
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: isSelected ? 'primary.main' : '#424242',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        border: '3px solid white',
                        transition: 'bgcolor 0.2s ease',
                      }}
                    >
                      {/* White center circle */}
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'white',
                          borderRadius: '50%',
                        }}
                      />
                    </Box>
                  </Box>
                </AdvancedMarker>
              )
            })}
        </Map>
      </Box>
    </APIProvider>
  )
}

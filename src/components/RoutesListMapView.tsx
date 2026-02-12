import { Box } from '@mui/material'
import { useState } from 'react'
import { RoutesList } from './RoutesList'
import { RoutesMap } from './RoutesMap'
import { toggleSavedRoute } from '@/server/saved-routes'

interface RoutesListMapViewProps {
  routes: Array<any>
  user: any
  initialSavedRoutes?: Record<string, boolean>
}

export function RoutesListMapView({
  routes,
  user,
  initialSavedRoutes,
}: RoutesListMapViewProps) {
  const [savedRoutes, setSavedRoutes] = useState<Record<string, boolean>>(
    initialSavedRoutes ||
      routes.reduce(
        (acc, route) => {
          acc[route.id] = route.isSaved || false
          return acc
        },
        {} as Record<string, boolean>,
      ),
  )

  const handleSaveClick = async (e: React.MouseEvent, routeId: string) => {
    e.stopPropagation()
    if (!user) return

    // Optimistic update
    setSavedRoutes((prev) => ({ ...prev, [routeId]: !prev[routeId] }))

    try {
      await toggleSavedRoute({ data: { routeId } })
    } catch (error) {
      // Revert on error
      setSavedRoutes((prev) => ({ ...prev, [routeId]: !prev[routeId] }))
      console.error('Failed to toggle saved route:', error)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flex: 1,
        overflow: 'hidden',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {/* Map */}
      <Box
        sx={{
          flex: 1,
          minHeight: { xs: 300, md: 500 },
          height: '100%',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
          pointerEvents: 'auto',
          order: { xs: -1, md: 1 },
        }}
      >
        <RoutesMap
          routes={routes}
          savedRoutes={savedRoutes}
          user={user}
          onSaveClick={handleSaveClick}
        />
      </Box>
      {/* List */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pr: 1,
          order: { xs: 0, md: 0 },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 1,
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        }}
      >
        <RoutesList
          routes={routes}
          savedRoutes={savedRoutes}
          user={user}
          onSaveClick={handleSaveClick}
        />
      </Box>
    </Box>
  )
}

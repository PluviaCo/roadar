import { Link, createFileRoute } from '@tanstack/react-router'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoutes } from '@/server/routes'
import { RoutesList } from '@/components/RoutesList'
import { RoutesMap } from '@/components/RoutesMap'

export const Route = createFileRoute('/routes/')({
  loader: async () => {
    return await fetchRoutes()
  },
  component: RoutesListComponent,
})

function RoutesListComponent() {
  const routes = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const [savedRoutes, setSavedRoutes] = useState<Record<string, boolean>>(
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
    <Stack spacing={2} padding={2} sx={{ height: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h1">Routes</Typography>
        {user && (
          <Link to="/routes/create">
            <Button variant="contained" startIcon={<AddIcon />}>
              Create Route
            </Button>
          </Link>
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flex: 1,
          overflow: 'hidden',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Map - above list on mobile, right on desktop */}
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
        {/* List on the left (desktop) / below map (mobile) */}
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
    </Stack>
  )
}

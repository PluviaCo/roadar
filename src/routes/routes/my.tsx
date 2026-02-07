import { Link, createFileRoute } from '@tanstack/react-router'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { createProtectedRoute } from '@/lib/protected-routes'
import { fetchUserRoutes } from '@/server/routes'
import { toggleSavedRoute } from '@/server/saved-routes'
import { RouteCard } from '@/components/RouteCard'

export const Route = createFileRoute('/routes/my')({
  ...createProtectedRoute(),
  loader: async () => {
    return await fetchUserRoutes()
  },
  component: MyRoutesComponent,
})

function MyRoutesComponent() {
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
    <Stack spacing={2} padding={2}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h1">My Routes</Typography>
        <Link to="/routes/create">
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Route
          </Button>
        </Link>
      </Box>

      {routes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You haven't created any routes yet.
          </Typography>
          <Link to="/routes/create">
            <Button variant="contained" sx={{ mt: 2 }}>
              Create Your First Route
            </Button>
          </Link>
        </Box>
      ) : (
        <Stack spacing={2}>
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isSaved={savedRoutes[route.id]}
              showSaveButton={true}
              onSaveClick={handleSaveClick}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

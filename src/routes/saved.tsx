import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { fetchSavedRoutes, toggleSavedRoute } from '@/server/saved-routes'
import { RouteCard } from '@/components/RouteCard'

export const Route = createFileRoute('/saved')({
  loader: async () => {
    return await fetchSavedRoutes()
  },
  component: SavedRoutesComponent,
})

function SavedRoutesComponent() {
  const routes = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const [savedRoutes, setSavedRoutes] = useState<Record<string, boolean>>(
    routes.reduce(
      (acc, route) => {
        acc[route.id] = true // All routes here are saved
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
      <Typography variant="h1" marginBottom={2}>
        Saved Routes
      </Typography>
      {routes.length > 0 ? (
        <Stack spacing={2}>
          {routes
            .filter((route) => savedRoutes[route.id])
            .map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                isSaved={savedRoutes[route.id]}
                showSaveButton={!!user}
                onSaveClick={handleSaveClick}
              />
            ))}
        </Stack>
      ) : (
        <Typography color="text.secondary">
          No saved routes yet. Browse routes and save your favorites!
        </Typography>
      )}
    </Stack>
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { useState } from 'react'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoutes } from '@/server/routes'

export const Route = createFileRoute('/routes/')({
  loader: async () => {
    return await fetchRoutes()
  },
  component: RoutesListComponent,
})

function RoutesListComponent() {
  const routes = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
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
      <Typography variant="h1" marginBottom={2}>
        Routes
      </Typography>
      <Stack spacing={2}>
        {routes.map((route) => (
          <Card key={route.id} sx={{ position: 'relative' }}>
            <CardActionArea
              onClick={() => navigate({ to: `/routes/${route.id}` })}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'stretch',
              }}
            >
              {route.photos.length > 0 && (
                <CardMedia
                  component="img"
                  image={route.photos[0]}
                  alt={route.name}
                  sx={{
                    width: { xs: '100%', md: 300 },
                    height: { xs: 200, md: 'auto' },
                    objectFit: 'cover',
                  }}
                />
              )}
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5">{route.name}</Typography>
                <Typography color="textSecondary">
                  {route.coordinates.length} stops
                  {route.photos.length > 0 &&
                    ` • ${route.photos.length} photo${route.photos.length !== 1 ? 's' : ''}`}
                </Typography>
              </CardContent>
            </CardActionArea>
            {user && (
              <IconButton
                onClick={(e) => handleSaveClick(e, route.id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                {savedRoutes[route.id] ? (
                  <Bookmark color="primary" />
                ) : (
                  <BookmarkBorder />
                )}
              </IconButton>
            )}
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

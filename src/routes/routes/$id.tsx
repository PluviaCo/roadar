import { createFileRoute } from '@tanstack/react-router'
import { IconButton, Stack, Typography } from '@mui/material'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import RoutePlotter from '@/components/RoutePlotter'
import { PhotoUpload } from '@/components/PhotoUpload'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoute } from '@/server/routes'

export const Route = createFileRoute('/routes/$id')({
  loader: async ({ params }) => {
    const route = await fetchRoute({ data: { id: params.id } })
    if (!route) {
      throw new Error(`Route not found: ${params.id}`)
    }
    return route
  },
  component: RouteDetailComponent,
  errorComponent: ({ error }) => (
    <Stack padding={2}>
      <Typography color="error">Error: {error.message}</Typography>
    </Stack>
  ),
})

function RouteDetailComponent() {
  const route = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const [isSaved, setIsSaved] = useState(route.isSaved || false)

  const handleSaveClick = async () => {
    if (!user) return

    // Optimistic update
    setIsSaved(!isSaved)

    try {
      await toggleSavedRoute({ data: { routeId: route.id } })
    } catch (error) {
      // Revert on error
      setIsSaved(!isSaved)
      console.error('Failed to toggle saved route:', error)
    }
  }

  // Calculate center of the route
  const center =
    route.coordinates.length > 0
      ? {
          lat:
            route.coordinates.reduce((sum, c) => sum + c.lat, 0) /
            route.coordinates.length,
          lng:
            route.coordinates.reduce((sum, c) => sum + c.lng, 0) /
            route.coordinates.length,
        }
      : { lat: 35.6762, lng: 139.6503 }

  return (
    <Stack spacing={2} padding={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">{route.name}</Typography>
        {user && (
          <IconButton onClick={handleSaveClick} size="large">
            {isSaved ? (
              <Bookmark color="primary" fontSize="large" />
            ) : (
              <BookmarkBorder fontSize="large" />
            )}
          </IconButton>
        )}
      </Stack>

      <Stack
        sx={{
          border: '1px solid #ccc',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={center}
            defaultZoom={12}
            style={{ width: '100%', height: '500px' }}
          >
            <RoutePlotter points={route.coordinates} />
          </Map>
        </APIProvider>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h6">Route Details</Typography>
        <Typography>
          Total Stops: <strong>{route.coordinates.length}</strong>
        </Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h6">Photos</Typography>
        {user && <PhotoUpload routeId={route.id} />}
        {route.photos.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {route.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Route photo ${index + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            ))}
          </div>
        ) : (
          <Typography>No photos available for this route.</Typography>
        )}
      </Stack>
    </Stack>
  )
}

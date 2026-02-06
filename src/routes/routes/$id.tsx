import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Stack, Typography } from '@mui/material'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import type { Route as RouteModel } from '@/db/routes'
import { getRouteById } from '@/db/routes'
import RoutePlotter from '@/components/RoutePlotter'

export const Route = createFileRoute('/routes/$id')({
  loader: async ({ params }) => {
    const route = await getRouteById(params.id)
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
  const navigate = useNavigate()

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
        <Button variant="outlined" onClick={() => navigate({ to: '/routes' })}>
          Back to Routes
        </Button>
      </Stack>

      <Typography color="textSecondary">
        {route.coordinates.length} stops
      </Typography>

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
    </Stack>
  )
}

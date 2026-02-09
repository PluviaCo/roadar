import { createFileRoute } from '@tanstack/react-router'
import { Box, Stack, Typography } from '@mui/material'
import { PhotoUpload } from '@/components/PhotoUpload'
import { fetchRoute } from '@/server/routes'

export const Route = createFileRoute('/routes/$id/photos')({
  loader: async ({ params }) => {
    const route = await fetchRoute({ data: { id: params.id } })
    if (!route) {
      throw new Error(`Route not found: ${params.id}`)
    }
    return { route }
  },
  component: RoutePhotosComponent,
  errorComponent: ({ error }) => (
    <Stack padding={2}>
      <Typography color="error">Error: {error.message}</Typography>
    </Stack>
  ),
})

function RoutePhotosComponent() {
  const { route } = Route.useLoaderData()
  const { user } = Route.useRouteContext()

  return (
    <Stack spacing={3} padding={2}>
      <Typography variant="h1">{route.name} - Photos</Typography>

      {user && <PhotoUpload routeId={route.id} />}

      {route.photos.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
                cursor: 'pointer',
              }}
              onClick={() => window.open(photo, '_blank')}
            />
          ))}
        </div>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No photos yet.{' '}
            {user ? 'Be the first to add one!' : 'Sign in to add photos.'}
          </Typography>
        </Box>
      )}
    </Stack>
  )
}

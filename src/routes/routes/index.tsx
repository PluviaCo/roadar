import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material'
import { createServerFn } from '@tanstack/react-start'

const fetchRoutes = createServerFn({ method: 'GET' }).handler(async () => {
  const { env } = await import('cloudflare:workers')
  const { getDb } = await import('@/db')
  const { getAllRoutes } = await import('@/db/routes')

  const db = getDb((env as any).DB)
  return await getAllRoutes(db)
})

export const Route = createFileRoute('/routes/')({
  loader: async () => {
    return await fetchRoutes()
  },
  component: RoutesListComponent,
})

function RoutesListComponent() {
  const routes = Route.useLoaderData()
  const navigate = useNavigate()

  return (
    <Stack spacing={2} padding={2}>
      <Typography variant="h1" marginBottom={2}>
        Routes
      </Typography>
      <Stack spacing={2}>
        {routes.map((route) => (
          <Card key={route.id}>
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
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Card,
  CardActionArea,
  CardContent,
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
            >
              <CardContent>
                <Typography variant="h5">{route.name}</Typography>
                <Typography color="textSecondary">
                  {route.coordinates.length} stops
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

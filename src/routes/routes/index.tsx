import { Link, createFileRoute } from '@tanstack/react-router'
import { Box, Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { fetchRoutes } from '@/server/routes'
import { RoutesListMapView } from '@/components/RoutesListMapView'

export const Route = createFileRoute('/routes/')({
  loader: async () => {
    return await fetchRoutes()
  },
  component: RoutesListComponent,
})

function RoutesListComponent() {
  const routes = Route.useLoaderData()
  const { user } = Route.useRouteContext()

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
      <RoutesListMapView routes={routes} user={user} />
    </Stack>
  )
}

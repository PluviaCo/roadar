import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { useState } from 'react'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoutes } from '@/server/routes'
import { RouteCard } from '@/components/RouteCard'

export const Route = createFileRoute('/')({
  loader: async () => {
    const routes = await fetchRoutes()
    // Show only the 6 most recent routes on home page
    return routes.slice(0, 6)
  },
  component: HomeComponent,
})

function HomeComponent() {
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

    setSavedRoutes((prev) => ({ ...prev, [routeId]: !prev[routeId] }))

    try {
      await toggleSavedRoute({ data: { routeId } })
    } catch (error) {
      setSavedRoutes((prev) => ({ ...prev, [routeId]: !prev[routeId] }))
      console.error('Failed to toggle saved route:', error)
    }
  }

  return (
    <Stack spacing={6}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          px: 3,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom fontWeight="bold">
            Discover Routes
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Explore, save, and share your favorite routes with photos
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate({ to: '/routes' })}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            View All Routes
          </Button>
        </Container>
      </Box>

      {/* Recent Routes Section */}
      <Container>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Recent Routes
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              isSaved={savedRoutes[route.id]}
              showSaveButton={!!user}
              onSaveClick={handleSaveClick}
              onClick={(routeId) => navigate({ to: `/routes/${routeId}` })}
            />
          ))}
        </Stack>
      </Container>
    </Stack>
  )
}

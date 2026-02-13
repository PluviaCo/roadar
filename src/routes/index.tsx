import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { useState } from 'react'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoutes } from '@/server/routes'
import { fetchRegions } from '@/server/regions'
import { RouteCard } from '@/components/RouteCard'
import { RouteSearchBar } from '@/components/RouteSearchBar'
import { fetchPrefectures } from '@/server/prefectures'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [routes, prefectures, regions] = await Promise.all([
      fetchRoutes(),
      fetchPrefectures(),
      fetchRegions(),
    ])
    return { routes, prefectures, regions }
  },
  component: HomeComponent,
})

function HomeComponent() {
  const { routes, prefectures, regions } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()

  const [savedRoutes, setSavedRoutes] = useState<Record<string, boolean>>(
    routes.reduce(
      (acc: Record<string, boolean>, route: any) => {
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

  // Always show only the first 6 recent routes
  const recentRoutes = routes.slice(0, 6)

  // Create a map of region_id to region for easy lookup
  const regionMap = regions.reduce(
    (acc: Record<number, (typeof regions)[number]>, region: any) => {
      acc[region.id] = region
      return acc
    },
    {},
  )

  // Group prefectures by region using region_id
  const prefecturesByRegionId = [...prefectures]
    .sort((a, b) => b.region_id - a.region_id) // Sort by region_id descending
    .reduce((acc, prefecture) => {
      const regionId = prefecture.region_id
      if (!acc.has(regionId)) {
        acc.set(regionId, [])
      }
      acc.get(regionId)!.push(prefecture)
      return acc
    }, new Map<number, Array<(typeof prefectures)[number]>>())

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
          {/* Search Bar with Dropdown */}
          <RouteSearchBar
            routes={routes}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: 'transparent',
                  border: 'none',
                },
              },
            }}
          />
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

      {/* Prefectures Section */}
      <Container>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Browse by Prefecture
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            mt: 3,
            overflowX: 'auto',
            pb: 2,
          }}
        >
          {Array.from(prefecturesByRegionId.entries()).map(
            ([regionId, prefecturesList]) => {
              const region = regionMap[regionId]
              return (
                <Box
                  key={regionId}
                  sx={{
                    flex: '0 0 auto',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1.5,
                      color: 'text.secondary',
                      fontWeight: 'bold',
                    }}
                  >
                    {region.name}
                  </Typography>
                  <Stack spacing={1}>
                    {prefecturesList.map((prefecture: any) => (
                      <Link
                        key={prefecture.id}
                        to="/routes/$id"
                        params={{ id: prefecture.key }}
                      >
                        <Chip
                          label={prefecture.name}
                          clickable
                          size="small"
                          sx={{
                            justifyContent: 'flex-start',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                            },
                          }}
                        />
                      </Link>
                    ))}
                  </Stack>
                </Box>
              )
            },
          )}
        </Box>
      </Container>

      {/* Routes Section */}
      <Container>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Recent Routes
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {recentRoutes.map((route: any) => (
            <RouteCard
              key={route.id}
              route={route}
              isSaved={savedRoutes[route.id]}
              showSaveButton={!!user}
              onSaveClick={handleSaveClick}
            />
          ))}
        </Stack>
      </Container>
    </Stack>
  )
}

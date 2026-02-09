import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowForward, LocationOn, Search } from '@mui/icons-material'
import { useState } from 'react'
import type { Route as RouteType } from '@/db/routes'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoutes } from '@/server/routes'
import { RouteCard } from '@/components/RouteCard'

export const Route = createFileRoute('/')({
  loader: async () => {
    const routes = await fetchRoutes()
    // Return all routes for searching
    return routes
  },
  component: HomeComponent,
})

function HomeComponent() {
  const routes = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
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

  // Always show only the first 6 recent routes
  const recentRoutes = routes.slice(0, 6)

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
          <Autocomplete
            freeSolo
            options={routes}
            getOptionLabel={(option) =>
              typeof option === 'string' ? option : option.name
            }
            filterOptions={(options, state) => {
              if (!state.inputValue.trim()) return []
              const query = state.inputValue.toLowerCase()
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(query) ||
                  option.description?.toLowerCase().includes(query),
              )
            }}
            onChange={(_, value) => {
              if (value && typeof value !== 'string') {
                navigate({ to: `/routes/${value.id}` })
                setSearchQuery('')
              }
            }}
            inputValue={searchQuery}
            onInputChange={(_, newValue) => setSearchQuery(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search for routes..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <Search sx={{ mr: 1, color: 'action.active' }} />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} sx={{ gap: 2 }}>
                {/* Image or Icon */}
                {option.photos.length > 0 ? (
                  <Box
                    component="img"
                    src={option.photos[0]}
                    alt={option.name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  >
                    <LocationOn sx={{ fontSize: 32, color: 'grey.500' }} />
                  </Box>
                )}
                {/* Text Content */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {option.name}
                  </Typography>
                  {option.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {option.description}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            sx={{
              mb: 3,
              backgroundColor: 'white',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
            ListboxProps={{
              sx: {
                maxHeight: 400,
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

      {/* Routes Section */}
      <Container>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Recent Routes
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {recentRoutes.map((route) => (
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

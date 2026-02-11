import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Button,
  IconButton,
  Rating,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import {
  DriveEta,
  Favorite,
  FavoriteBorder,
  Lock,
  PhotoLibrary,
  Public,
  Share,
} from '@mui/icons-material'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import RoutePlotter from '@/components/RoutePlotter'
import { TripForm } from '@/components/TripForm'
import { TripCard } from '@/components/TripCard'
import { CustomButtonLink } from '@/components/CustomButtonLink'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoute, updateRoutePrivacy } from '@/server/routes'
import { createTrip, fetchTripsByRoute, toggleTripLike } from '@/server/trips'
import { formatDistance, formatDuration } from '@/lib/route-utils'
import { useSnackbar } from '@/components/SnackbarProvider'

export const Route = createFileRoute('/routes/$id/')({
  loader: async ({ params }) => {
    const [route, trips] = await Promise.all([
      fetchRoute({ data: { id: params.id } }),
      fetchTripsByRoute({ data: { routeId: params.id } }),
    ])
    if (!route) {
      throw new Error(`Route not found: ${params.id}`)
    }
    return { route, trips }
  },
  component: RouteDetailComponent,
  errorComponent: ({ error }) => (
    <Stack padding={2}>
      <Typography color="error">Error: {error.message}</Typography>
    </Stack>
  ),
})

function RouteDetailComponent() {
  const photosDisplayCount = 4
  const { route: initialRoute, trips: initialTrips } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const { showSnack } = useSnackbar()
  const [route, setRoute] = useState(initialRoute)
  const [isSaved, setIsSaved] = useState(route.isSaved || false)
  const [trips, setTrips] = useState(initialTrips)
  const [tripFormOpen, setTripFormOpen] = useState(false)

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

  const handleShare = async () => {
    const url = window.location.href
    const shareData = {
      title: route.name,
      text: route.description || `Check out this route: ${route.name}`,
      url: url,
    }

    try {
      // Try Web Share API first (works on mobile)
      if ('share' in navigator && typeof navigator.share === 'function') {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        showSnack('Link copied to clipboard!')
      }
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to share:', error)
      }
    }
  }

  const handlePrivacyToggle = async () => {
    if (!user || route.userId !== user.id) return

    // Optimistic update
    const newIsPublic = !route.isPublic
    setRoute({ ...route, isPublic: newIsPublic })

    try {
      await updateRoutePrivacy({
        data: { routeId: route.id, isPublic: newIsPublic },
      })
    } catch (error) {
      // Revert on error
      setRoute({ ...route, isPublic: !newIsPublic })
      console.error('Failed to toggle route privacy:', error)
    }
  }

  const handleTripLike = async (tripId: string) => {
    if (!user) return

    // Optimistic update
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              isLiked: !trip.isLiked,
              likeCount: trip.isLiked ? trip.likeCount - 1 : trip.likeCount + 1,
            }
          : trip,
      ),
    )

    try {
      await toggleTripLike({ data: { tripId } })
    } catch (error) {
      // Revert on error
      setTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === tripId
            ? {
                ...trip,
                isLiked: !trip.isLiked,
                likeCount: trip.isLiked
                  ? trip.likeCount + 1
                  : trip.likeCount - 1,
              }
            : trip,
        ),
      )
      console.error('Failed to toggle trip like:', error)
    }
  }

  const handlePostTrip = async (data: {
    rating: number | null
    title: string
    notes: string
    date: string
    photos: Array<File>
  }) => {
    // Convert photos to number arrays for serialization
    const photoArrays = await Promise.all(
      data.photos.map(async (file) => {
        const buffer = await file.arrayBuffer()
        return Array.from(new Uint8Array(buffer))
      }),
    )

    const tripData = {
      routeId: route.id,
      title: data.title,
      notes: data.notes || null,
      coordinates: route.coordinates,
      date: data.date,
      rating: data.rating,
      photos: photoArrays,
    }

    await createTrip({
      data: tripData,
    })

    // Refresh trips
    const updatedTrips = await fetchTripsByRoute({
      data: { routeId: route.id },
    })
    setTrips(updatedTrips)
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
      <Typography variant="h1">{route.name}</Typography>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {route.averageRating ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={route.averageRating} precision={0.1} readOnly />
            <Typography variant="body1" fontWeight="medium">
              {route.averageRating.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ({route.tripCount} trip{route.tripCount !== 1 ? 's' : ''})
            </Typography>
          </Box>
        ) : (
          <span></span>
        )}
        <Stack direction="row" alignItems="center" spacing={1}>
          {user && (
            <Button
              variant="contained"
              startIcon={<DriveEta />}
              onClick={() => setTripFormOpen(true)}
            >
              Post Trip
            </Button>
          )}
          {/* Show privacy status only if current user owns this route */}
          {route.userId && user?.id === route.userId && (
            <IconButton
              onClick={handlePrivacyToggle}
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              {route.isPublic ? <Public /> : <Lock />}
            </IconButton>
          )}
          <IconButton
            onClick={handleShare}
            sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
          >
            <Share />
          </IconButton>
          {user && (
            <IconButton
              onClick={handleSaveClick}
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              {isSaved ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          )}
        </Stack>
      </Stack>

      {route.description && (
        <Typography variant="body1" color="textSecondary">
          {route.description}
        </Typography>
      )}

      {/* Photos Section - Show limited preview */}
      {route.photos.length > 0 && (
        <Box>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '16px',
            }}
          >
            {route.photos.slice(0, photosDisplayCount).map((photo, index) => (
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
          <CustomButtonLink
            variant="outlined"
            startIcon={<PhotoLibrary />}
            to="/routes/$id/photos"
            params={{ id: route.id }}
          >
            {`${route.photos.length} photos`}
          </CustomButtonLink>
        </Box>
      )}

      {/* Show button if no photos but user can upload */}
      {route.photos.length === 0 && user && (
        <CustomButtonLink
          variant="outlined"
          startIcon={<PhotoLibrary />}
          to="/routes/$id/photos"
          params={{ id: route.id }}
        >
          Add photos
        </CustomButtonLink>
      )}

      <Stack
        sx={{
          borderRadius: 4,
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

      {(route.distance != null || route.duration != null) && (
        <Stack direction="row" spacing={4}>
          {route.distance != null && (
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {formatDistance(route.distance)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Distance
              </Typography>
            </Box>
          )}
          {route.duration != null && (
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {formatDuration(route.duration)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Duration
              </Typography>
            </Box>
          )}
        </Stack>
      )}

      <Stack spacing={2}>
        <Typography variant="h6">Trips</Typography>
        {trips.length > 0 ? (
          <Stack spacing={2}>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                showLikeButton={!!user}
                onLikeClick={handleTripLike}
              />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">
            No trips posted yet. Be the first to share your experience!
          </Typography>
        )}
      </Stack>

      {user && (
        <TripForm
          open={tripFormOpen}
          onClose={() => setTripFormOpen(false)}
          routeId={route.id}
          routeName={route.name}
          onSubmit={handlePostTrip}
        />
      )}
    </Stack>
  )
}

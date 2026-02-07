import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Button,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import { Bookmark, BookmarkBorder, DriveEta } from '@mui/icons-material'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import RoutePlotter from '@/components/RoutePlotter'
import { PhotoUpload } from '@/components/PhotoUpload'
import { TripForm } from '@/components/TripForm'
import { TripCard } from '@/components/TripCard'
import { toggleSavedRoute } from '@/server/saved-routes'
import { fetchRoute } from '@/server/routes'
import { createTrip, fetchTripsByRoute, toggleTripLike } from '@/server/trips'

export const Route = createFileRoute('/routes/$id')({
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
  const { route, trips: initialTrips } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">{route.name}</Typography>
        <Stack direction="row" spacing={1}>
          {user && (
            <Button
              variant="contained"
              startIcon={<DriveEta />}
              onClick={() => setTripFormOpen(true)}
            >
              Post Trip
            </Button>
          )}
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
      </Stack>

      {(route.averageRating || route.description) && (
        <Stack spacing={1}>
          {route.averageRating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={route.averageRating} precision={0.1} readOnly />
              <Typography variant="body1" fontWeight="medium">
                {route.averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ({route.tripCount} trip{route.tripCount !== 1 ? 's' : ''})
              </Typography>
            </Box>
          )}
          {route.description && (
            <Typography variant="body1" color="textSecondary">
              {route.description}
            </Typography>
          )}
        </Stack>
      )}

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

      <Stack spacing={2}>
        <Typography variant="h6">Trips ({trips.length})</Typography>
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

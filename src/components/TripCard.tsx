import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Stack,
  Typography,
} from '@mui/material'
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material'
import type { Trip } from '@/db/trips'

interface TripCardProps {
  trip: Trip
  showLikeButton: boolean
  onLikeClick: (tripId: string) => void
}

export function TripCard({ trip, showLikeButton, onLikeClick }: TripCardProps) {
  const tripDate = new Date(trip.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card>
      {trip.photos.length > 0 && (
        <CardMedia
          component="img"
          image={trip.photos[0]}
          alt={trip.title}
          sx={{
            height: 200,
            objectFit: 'cover',
          }}
        />
      )}
      <CardContent>
        <Stack spacing={1}>
          {/* Title and Rating */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {trip.title}
              </Typography>
              {trip.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={trip.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {trip.rating.toFixed(1)}
                  </Typography>
                </Box>
              )}
            </Box>
            {showLikeButton && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => onLikeClick(trip.id)}
                  color={trip.isLiked ? 'primary' : 'default'}
                >
                  {trip.isLiked ? <ThumbUp /> : <ThumbUpOutlined />}
                </IconButton>
                <Typography variant="body2" color="text.secondary">
                  {trip.likeCount}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Date */}
          <Typography variant="body2" color="text.secondary">
            {tripDate}
          </Typography>

          {/* Notes */}
          {trip.notes && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {trip.notes}
            </Typography>
          )}

          {/* Photo Count */}
          {trip.photos.length > 1 && (
            <Typography variant="caption" color="text.secondary">
              +{trip.photos.length - 1} more photo
              {trip.photos.length - 1 !== 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

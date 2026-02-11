import {
  Avatar,
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
    month: 'short',
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
        <Stack spacing={2}>
          {/* User info section */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Avatar
              src={trip.user.pictureUrl || undefined}
              alt={trip.user.name}
              sx={{ width: 48, height: 48 }}
            >
              {trip.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {trip.user.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                {trip.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating
                      value={trip.rating}
                      readOnly
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: 'text.primary',
                        },
                        '& .MuiRating-iconHover': {
                          color: 'text.secondary',
                        },
                      }}
                    />
                  </Box>
                )}
                <Typography variant="body2" color="text.secondary">
                  {tripDate}
                </Typography>
              </Box>
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

          {/* Title */}
          <Typography variant="h6">{trip.title}</Typography>

          {/* Notes */}
          {trip.notes && (
            <Typography variant="body2" color="text.secondary">
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

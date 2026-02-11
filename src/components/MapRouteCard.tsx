import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material'
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material'
import { Link } from '@tanstack/react-router'
import type { Route } from '@/db/routes'

interface MapRouteCardProps {
  route: Route
  isSaved: boolean
  showSaveButton: boolean
  onSaveClick: (e: React.MouseEvent, routeId: string) => void
}

export function MapRouteCard({
  route,
  isSaved,
  showSaveButton,
  onSaveClick,
}: MapRouteCardProps) {
  const hasPhoto = route.photos.length > 0

  return (
    <Card
      sx={{
        position: 'relative',
        width: 240,
        overflow: 'hidden',
      }}
    >
      <CardActionArea
        component={Link}
        to={`/routes/${route.id}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {hasPhoto && (
          <Box
            component="img"
            src={route.photos[0]}
            alt={route.name}
            sx={{
              width: '100%',
              height: 120,
              objectFit: 'cover',
            }}
          />
        )}
        <CardContent sx={{ pb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {route.name}
          </Typography>
          {route.averageRating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: 16, color: 'warning.main' }} />
              <Typography variant="body2" fontWeight="medium">
                {route.averageRating.toFixed(1)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
      {showSaveButton && (
        <IconButton
          onClick={(e) => onSaveClick(e, route.id)}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            width: 32,
            height: 32,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          {isSaved ? (
            <Favorite sx={{ fontSize: 18 }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      )}
    </Card>
  )
}

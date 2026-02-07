import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { Link } from '@tanstack/react-router'
import type { Route } from '@/db/routes'

interface RouteCardProps {
  route: Route
  isSaved: boolean
  showSaveButton: boolean
  onSaveClick: (e: React.MouseEvent, routeId: string) => void
}

export function RouteCard({
  route,
  isSaved,
  showSaveButton,
  onSaveClick,
}: RouteCardProps) {
  return (
    <Card sx={{ position: 'relative' }}>
      <CardActionArea
        component={Link}
        to={`/routes/${route.id}`}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {route.photos.length > 0 && (
          <CardMedia
            component="img"
            image={route.photos[0]}
            alt={route.name}
            sx={{
              width: { xs: '100%', md: 300 },
              height: { xs: 200, md: 'auto' },
              objectFit: 'cover',
            }}
          />
        )}
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5">{route.name}</Typography>
          <Typography color="textSecondary">
            {route.coordinates.length} stops
            {route.photos.length > 0 &&
              ` • ${route.photos.length} photo${route.photos.length !== 1 ? 's' : ''}`}
          </Typography>
        </CardContent>
      </CardActionArea>
      {showSaveButton && (
        <IconButton
          onClick={(e) => onSaveClick(e, route.id)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          {isSaved ? <Bookmark color="primary" /> : <BookmarkBorder />}
        </IconButton>
      )}
    </Card>
  )
}

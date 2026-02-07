import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import type { RouteCoordinate } from '@/db/routes'
import { createProtectedRoute } from '@/lib/protected-routes'
import { createRoute } from '@/server/routes'
import { useSnackbar } from '@/components/SnackbarProvider'

export const Route = createFileRoute('/routes/create')({
  ...createProtectedRoute(),
  component: CreateRoute,
})

function CreateRoute() {
  const router = useRouter()
  const { showSnack } = useSnackbar()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [coordinates, setCoordinates] = useState<Array<RouteCoordinate>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addWaypoint = () => {
    // For now, add a default waypoint - in the future this will be from map clicks
    const newPoint: RouteCoordinate = {
      lat: 35.6762 + (Math.random() - 0.5) * 0.01, // Random point near Tokyo
      lng: 139.6503 + (Math.random() - 0.5) * 0.01,
    }
    setCoordinates((prev) => [...prev, newPoint])
  }

  const removeWaypoint = (index: number) => {
    setCoordinates((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!name.trim()) {
        showSnack('Route name is required', 'error')
        return
      }

      if (coordinates.length < 2) {
        showSnack('At least 2 waypoints are required', 'error')
        return
      }

      const result = await createRoute({
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          coordinates,
          isPublic,
        },
      })

      showSnack('Route created successfully!', 'success')
      router.navigate({ to: `/routes/${result.routeId}` })
    } catch (error) {
      console.error('Failed to create route:', error)
      showSnack('Failed to create route', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Route
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Build a custom route by adding waypoints and setting details
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Route Name */}
            <TextField
              label="Route Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              placeholder="e.g., Mount Fuji Trail"
            />

            {/* Description */}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              placeholder="Describe your route, key features, or tips..."
            />

            {/* Public/Private Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
              }
              label="Make route public"
            />

            {/* Waypoints Section */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Waypoints ({coordinates.length})
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add waypoints to define your route path. Currently using demo
                coordinates.
              </Typography>

              {coordinates.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 2 }}
                  flexWrap="wrap"
                  useFlexGap
                >
                  {coordinates.map((coord, index) => (
                    <Chip
                      key={index}
                      label={`Point ${index + 1}: ${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`}
                      onDelete={() => removeWaypoint(index)}
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              )}

              <Button variant="outlined" onClick={addWaypoint} sx={{ mb: 2 }}>
                Add Waypoint (Demo)
              </Button>

              {coordinates.length < 2 && (
                <Alert severity="info">
                  Add at least 2 waypoints to create a route
                </Alert>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || coordinates.length < 2 || !name.trim()}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? 'Creating Route...' : 'Create Route'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

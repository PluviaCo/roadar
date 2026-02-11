import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Close, CloudUpload } from '@mui/icons-material'

interface TripFormProps {
  open: boolean
  onClose: () => void
  routeId: string
  routeName: string
  onSubmit: (data: {
    rating: number | null
    title: string
    notes: string
    date: string
    photos: Array<File>
  }) => Promise<void>
}

export function TripForm({
  open,
  onClose,
  routeId,
  routeName,
  onSubmit,
}: TripFormProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [photos, setPhotos] = useState<Array<File>>([])
  const [loading, setLoading] = useState(false)

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (!rating) {
      alert('Please select a rating')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        rating,
        title: title || `${routeName} - ${date}`,
        notes: notes || '',
        date,
        photos,
      })
      // Reset form
      setRating(null)
      setTitle('')
      setNotes('')
      setDate(new Date().toISOString().split('T')[0])
      setPhotos([])
      onClose()
    } catch (error) {
      console.error('Failed to post trip:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      alert(`Failed to post trip: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Post Your Trip
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Rating */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              How was this route? *
            </Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
              size="large"
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

          {/* Date */}
          <TextField
            label="Trip Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* Title */}
          <TextField
            label="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            placeholder={`${routeName} - ${date}`}
            helperText="Leave blank for auto-generated title"
          />

          {/* Notes */}
          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Share your experience..."
          />

          {/* Photos */}
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
            >
              {photos.length > 0
                ? `${photos.length} photo${photos.length !== 1 ? 's' : ''} selected`
                : 'Add Photos (optional)'}
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handlePhotoSelect}
              />
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!rating || loading}
        >
          {loading ? 'Posting...' : 'Post Trip'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

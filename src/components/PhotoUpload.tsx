import { useState } from 'react'
import { Button, CircularProgress, Stack, Typography } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import { uploadPhoto } from '@/server/photos'

export function PhotoUpload({ routeId }: { routeId: string }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // Convert File to ArrayBuffer for serialization
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = Array.from(new Uint8Array(arrayBuffer))

      await uploadPhoto({
        data: {
          routeId,
          fileData: uint8Array,
          fileName: file.name,
          contentType: file.type,
        },
      })
      setSuccess(true)
      // Reset file input
      event.target.value = ''
      // Reload the page to show new photo
      setTimeout(() => window.location.reload(), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Button
        component="label"
        variant="contained"
        startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Photo'}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </Button>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {success && (
        <Typography color="success.main" variant="body2">
          Photo uploaded successfully!
        </Typography>
      )}
    </Stack>
  )
}

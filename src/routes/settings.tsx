import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
// ...existing code...
import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from '@/components/SnackbarProvider'
import { createProtectedRoute } from '@/lib/protected-routes'
import { updateUserProfile } from '@/server/users'

export const Route = createFileRoute('/settings')({
  ...createProtectedRoute(),
  component: Settings,
})

function Settings() {
  const { user } = Route.useRouteContext()
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.picture_url || null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showSnack } = useSnackbar()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let profilePicture: Array<number> | undefined

      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer()
        profilePicture = Array.from(new Uint8Array(arrayBuffer))
      }

      await updateUserProfile({
        data: {
          name,
          profilePicture,
        },
      })

      // Invalidate and refresh to update user data in context
      await router.invalidate()
      showSnack('Profile updated successfully!', 'success')
    } catch (error) {
      console.error('Failed to update profile:', error)
      showSnack('Failed to update profile', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update your profile information
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Profile Picture */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="subtitle1">Profile Picture</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box component="label" sx={{ cursor: 'pointer' }}>
                  <Avatar
                    src={previewUrl || undefined}
                    alt={name}
                    sx={{ width: 80, height: 80 }}
                  />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Click avatar to change
                </Typography>
              </Box>
            </Box>

            {/* Name */}
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

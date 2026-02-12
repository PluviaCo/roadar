import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

export const Route = createFileRoute('/signin')({
  component: SignIn,
})

function SignIn() {
  const handleLineSignIn = () => {
    const lineSignInUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
      import.meta.env.VITE_LINE_CHANNEL_ID
    }&redirect_uri=${
      import.meta.env.VITE_LINE_CALLBACK_URI
    }&state=12345&scope=profile%20openid%20email`
    window.location.href = lineSignInUrl
  }

  return (
    <Stack spacing={0} sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Signin Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          px: 2,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={3}>
            <Stack spacing={1}>
              <Typography variant="h3" fontWeight="bold">
                Welcome back
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sign in to begin exploring
              </Typography>
            </Stack>

            <Divider />

            <Button
              variant="contained"
              size="large"
              onClick={handleLineSignIn}
              sx={{
                backgroundColor: '#06c755',
                fontWeight: 'bold',
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#05b347',
                },
              }}
            >
              Continue with LINE
            </Button>
          </Stack>
        </Card>
      </Box>
    </Stack>
  )
}

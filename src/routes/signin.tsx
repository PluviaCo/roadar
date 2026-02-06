import { createFileRoute } from '@tanstack/react-router'
import { Box, Button, Stack, Typography } from '@mui/material'

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
    <Stack
      spacing={4}
      padding={2}
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Stack spacing={2} textAlign="center">
        <Typography variant="h3">Welcome</Typography>
        <Typography variant="body1" color="textSecondary">
          Sign in with LINE to access your account
        </Typography>
      </Stack>

      <Box>
        <Button
          variant="contained"
          size="large"
          onClick={handleLineSignIn}
          sx={{ backgroundColor: '#00b900' }}
        >
          Sign in with LINE
        </Button>
      </Box>
    </Stack>
  )
}

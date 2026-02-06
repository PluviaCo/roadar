import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signin')({
  component: SignIn,
})

function SignIn() {
  const handleLineSignIn = () => {
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
      import.meta.env.VITE_LINE_CHANNEL_ID
    }&redirect_uri=${
      import.meta.env.VITE_LINE_CALLBACK_URI
    }&state=12345&scope=profile%20openid%20email`
    window.location.href = lineLoginUrl
  }

  return (
    <div className="p-2">
      <h3>Sign In</h3>
      <button onClick={handleLineSignIn}>Continue with LINE</button>
    </div>
  )
}

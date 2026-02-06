import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const handleLineLogin = () => {
    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
      import.meta.env.VITE_LINE_CHANNEL_ID
    }&redirect_uri=${
      import.meta.env.VITE_LINE_CALLBACK_URI
    }&state=12345&scope=profile%20openid%20email`
    window.location.href = lineLoginUrl
  }

  return (
    <div className="p-2">
      <h3>Login</h3>
      <button onClick={handleLineLogin}>Login with LINE</button>
    </div>
  )
}

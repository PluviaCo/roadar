import { createFileRoute } from '@tanstack/react-router'
import { createLineUser } from '@/db/users'

export const Route = createFileRoute('/auth/line/callback')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        // const { db } = request.context.cloudflare.env.DB
        console.log('here')
        console.log(context)
        console.log(request)
        const env =
          (context as any).cloudflare?.env ||
          (context as any).h3Event?.context?.cloudflare?.env ||
          (request as any).context?.cloudflare?.env

        const db = env?.DB // Ensure this is "DB" to match wrangler.jsonc
        if (!db) {
          throw new Error('Database not available')
        }

        const url = new URL(request.url)
        const code = url.searchParams.get('code')!
        console.log(code)
        console.log(process.env.VITE_LINE_REDIRECT_URI)
        console.log((context as any).cloudflare)
        // console.log(code)
        // console.log(code)

        const tokenResponse = await fetch(
          'https://api.line.me/oauth2/v2.1/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code,
              redirect_uri: process.env.VITE_LINE_CALLBACK_URI,
              client_id: process.env.VITE_LINE_CHANNEL_ID,
              client_secret: process.env.LINE_CHANNEL_SECRET,
            }),
          },
        )

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token')
        }

        const profileResponse = await fetch('https://api.line.me/v2/profile', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        })

        const profileData = await profileResponse.json()
        console.log(profileData)

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const newUser = await createLineUser(db, profileData)

        // return { userId: newUser.userId }
        return new Response('Hello, World! from ' + request.url)
      },
    },
  },
})

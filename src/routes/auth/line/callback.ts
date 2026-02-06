import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { createLineUser } from '@/db/users'

export const Route = createFileRoute('/auth/line/callback')({
  server: {
    handlers: {
      GET: async ({ request, context }) => {
        // const { db } = request.context.cloudflare.env.DB
        console.log('here')
        console.log(context)
        console.log(request)
        console.log('2')
        const db = (env as any).DB // "DB" is the binding name from wrangler.jsonc
        if (!db) {
          console.log('Throwing in database')
          throw new Error('Database not available')
        }

        // 2. Extract values from 'env', NOT 'process.env'
        const client_id = env.VITE_LINE_CHANNEL_ID
        const client_secret = env.LINE_CHANNEL_SECRET
        const redirect_uri = env.VITE_LINE_CALLBACK_URI

        const url = new URL(request.url)
        const code = url.searchParams.get('code')!
        console.log('settings')
        console.log('redirect_uri: ', redirect_uri)
        console.log('client_id: ', client_id)
        // console.log(client_secret)
        console.log('code: ', code)

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
              redirect_uri: redirect_uri,
              client_id: client_id,
              client_secret: client_secret,
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

import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { createLineUser } from '@/db/users'
import { useAppSession } from '@/lib/session'

export const Route = createFileRoute('/auth/line/callback')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const db = (env as any).DB
        if (!db) {
          throw new Error('Database not available')
        }

        const client_id = env.VITE_LINE_CHANNEL_ID
        const client_secret = env.LINE_CHANNEL_SECRET
        const redirect_uri = env.VITE_LINE_CALLBACK_URI

        const url = new URL(request.url)
        const code = url.searchParams.get('code')

        if (!code) {
          throw new Error('Missing authorization code')
        }

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
              redirect_uri,
              client_id,
              client_secret,
            }),
          },
        )

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token')
        }

        const token: LineTokenData = tokenData as LineTokenData

        const profileResponse = await fetch('https://api.line.me/v2/profile', {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })

        const profileData = await profileResponse.json()

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const profile: LineProfileData = profileData as LineProfileData

        // Create user in database
        const user = await createLineUser(db, profile)

        // Create session
        const session = await useAppSession()

        await session.update({
          id: user.id,
          email: user.name,
        })

        // Redirect to home
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/',
          },
        })
      },
    },
  },
})
interface LineProfileData {
  userId: string
  displayName?: string
  pictureUrl?: string
}

interface LineTokenData {
  access_token: string
  expires_in: number
  id_token: string
  refresh_token: string
  scope: string
  token_type: string
}

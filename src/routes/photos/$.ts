import { createFileRoute } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'

export const Route = createFileRoute('/photos/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const bucket = (env as any).PHOTOS_BUCKET
        if (!bucket) {
          throw new Error('R2 bucket not configured')
        }

        const filename = (params as any)._splat || ''

        const object = await bucket.get(filename)
        if (!object) {
          return new Response('Photo not found', { status: 404 })
        }

        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000',
          },
        })
      },
    },
  },
})

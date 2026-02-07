import { createServerFn } from '@tanstack/react-start'

export const uploadPhoto = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      routeId: string
      fileData: Array<number>
      fileName: string
      contentType: string
    }) => data,
  )
  .handler(async ({ data }) => {
    const { env } = await import('cloudflare:workers')
    const { getDb } = await import('@/db')
    const { useAppSession } = await import('@/lib/session')

    // Check authentication
    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const userId = session.data.id
    const routeId = Number(data.routeId)

    // Validate that the route exists
    const db = getDb((env as any).DB)
    const route = await db
      .selectFrom('routes')
      .select('id')
      .where('id', '=', routeId)
      .executeTakeFirst()

    if (!route) {
      throw new Error('Route not found')
    }

    // Validate that the user exists
    const user = await db
      .selectFrom('users')
      .select('id')
      .where('id', '=', userId)
      .executeTakeFirst()

    if (!user) {
      throw new Error('User not found')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = data.fileName.split('.').pop()
    const filename = `routes/${routeId}/${userId}_${timestamp}.${extension}`

    // Upload to R2
    const bucket = (env as any).PHOTOS_BUCKET
    if (!bucket) {
      throw new Error('R2 bucket not configured')
    }

    // Convert number array back to Uint8Array
    const uint8Array = new Uint8Array(data.fileData)
    await bucket.put(filename, uint8Array, {
      httpMetadata: {
        contentType: data.contentType,
      },
    })

    // Use local server route to serve photos
    const publicUrl = `/photos/${filename}`

    // Save to database
    await db
      .insertInto('photos')
      .values({
        route_id: routeId,
        user_id: userId,
        url: publicUrl,
      })
      .execute()

    return { url: publicUrl, filename }
  })

import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { updateUser } from '@/db/users'
import { useAppSession } from '@/lib/session'

export interface UpdateProfileData {
  name?: string
  profilePicture?: Array<number> // File converted to number array
}

export const updateUserProfile = createServerFn({ method: 'POST' })
  .inputValidator((data: UpdateProfileData) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = env.DB
    const bucket = (env as any).PHOTOS_BUCKET

    let pictureUrl: string | undefined

    // Upload profile picture to R2 if provided
    if (data.profilePicture && data.profilePicture.length > 0) {
      const timestamp = Date.now()
      const photoKey = `users/${session.data.id}_profile_${timestamp}.jpg`
      const photoBuffer = new Uint8Array(data.profilePicture)

      await bucket.put(photoKey, photoBuffer, {
        httpMetadata: {
          contentType: 'image/jpeg',
        },
      })

      pictureUrl = `/photos/${photoKey}`
    }

    const updatedUser = await updateUser(db, session.data.id, {
      ...(data.name !== undefined && { name: data.name }),
      ...(pictureUrl && { picture_url: pictureUrl }),
    })

    return updatedUser
  })

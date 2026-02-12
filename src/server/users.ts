import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { env } from 'cloudflare:workers'
import { getUser, updateUser } from '@/db/users'
import { useAppSession } from '@/lib/session'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useAppSession()

  if (!session.data.id) {
    return null
  }

  const db = (env as any).DB
  const user = await getUser(db, session.data.id)

  if (!user) {
    // User no longer exists in database, clear the session
    session.clear()
    return null
  }

  return {
    id: user.id,
    email: user.email || undefined,
    name: user.name,
    picture_url: user.picture_url || undefined,
  }
})

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

    const updatedUser = await updateUser((env as any).DB, session.data.id, {
      ...(data.name !== undefined && { name: data.name }),
      ...(pictureUrl && { picture_url: pictureUrl }),
    })

    return updatedUser
  })

export const logout = createServerFn().handler(async () => {
  const session = await useAppSession()
  session.clear()

  throw redirect({
    href: '/',
  })
})

import { sql } from 'kysely'
import { getDb } from '.'
import type { D1Database } from '@cloudflare/workers-types'

export interface ProfileData {
  userId: string
  displayName?: string
  statusMessage?: string
  pictureUrl?: string
  email?: string
}

export async function createLineUser(db: D1Database, profileData: ProfileData) {
  if (!profileData.displayName) {
    throw new Error('displayName is required')
  }

  const kysely = getDb(db)

  const lineUser = await kysely
    .selectFrom('line_users')
    .where('line_user_id', '=', profileData.userId)
    .select('user_id')
    .executeTakeFirst()

  if (lineUser) {
    return { userId: lineUser.user_id }
  }

  const user = await createUser(db, {
    name: profileData.displayName,
    email: profileData.email || null,
    picture_url: profileData.pictureUrl || null,
  })

  await kysely
    .insertInto('line_users')
    .values({
      user_id: user.id,
      line_user_id: profileData.userId,
      updated_at: sql`CURRENT_TIMESTAMP`,
      created_at: sql`CURRENT_TIMESTAMP`,
    })
    .execute()

  return { userId: user.id }
}

export async function createUser(
  db: D1Database,
  data: {
    name: string
    email: string | null
    picture_url: string | null
  },
) {
  const kysely = getDb(db)

  const newUser = await kysely
    .insertInto('users')
    .values({
      name: data.name,
      email: data.email,
      picture_url: data.picture_url,
      updated_at: sql`CURRENT_TIMESTAMP` as any,
      created_at: sql`CURRENT_TIMESTAMP` as any,
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  return newUser
}

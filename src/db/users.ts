import { sql } from 'kysely'
import { getDb } from '.'

export interface ProfileData {
  userId: string
  displayName?: string
  pictureUrl?: string
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
    const user = getUser(db, lineUser.user_id)
    return user
  }

  const user = await createUser(db, {
    name: profileData.displayName,
    email: null,
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

  return user
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
    .returningAll()
    .executeTakeFirstOrThrow()

  return newUser
}

export async function getUser(db: D1Database, id: number) {
  const kysely = getDb(db)

  const user = await kysely
    .selectFrom('users')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirstOrThrow()

  return user
}

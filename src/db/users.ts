import { getDb } from '.'

export async function createLineUser(lineUserId: string) {
  const db = getDb(DB)

  const lineUser = await db
    .selectFrom('line_users')
    .where('line_user_id', '=', lineUserId)
    .select('user_id')
    .executeTakeFirst()

  if (lineUser) {
    return { userId: lineUser.user_id }
  }

  const user = await createUser()

  await db
    .insertInto('line_users')
    .values({
      user_id: user.id,
      line_user_id: lineUserId,
    })
    .execute()
}

export async function createUser() {
  const newUser = await db
    .selectFrom('users')
    .select('id')
    .orderBy('id', 'desc')
    .executeTakeFirst()

  if (!newUser) {
    throw new Error('Failed to create user')
  }
  return newUser
}

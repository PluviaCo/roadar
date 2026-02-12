import type { Kysely } from 'kysely'
import type { DB } from './types'

export interface Prefecture {
  id: number
  key: string
  name: string
  region: string
}

// Get all prefectures
export async function getAllPrefectures(
  db: Kysely<DB>,
): Promise<Array<Prefecture>> {
  const prefectures = await db
    .selectFrom('prefectures')
    .selectAll()
    .orderBy('id', 'asc')
    .execute()

  return prefectures.map((p) => ({
    id: p.id,
    key: p.key,
    name: p.name,
    region: p.region,
  }))
}

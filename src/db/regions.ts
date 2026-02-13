import type { Kysely } from 'kysely'
import type { DB } from './types'

export interface Region {
  id: number
  key: string
  name: string
}

// Get all regions
export async function getAllRegions(db: Kysely<DB>): Promise<Array<Region>> {
  const regions = await db
    .selectFrom('regions')
    .selectAll()
    .orderBy('id', 'asc')
    .execute()

  return regions.map((r) => ({
    id: r.id,
    key: r.key,
    name: r.name,
  }))
}

// Get region by key
export async function getRegionByKey(
  db: Kysely<DB>,
  key: string,
): Promise<Region | undefined> {
  const region = await db
    .selectFrom('regions')
    .selectAll()
    .where('key', '=', key)
    .executeTakeFirst()

  if (!region) return undefined

  return {
    id: region.id,
    key: region.key,
    name: region.name,
  }
}

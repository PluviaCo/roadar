import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import type { DB } from './types'

export function getDb(d1: D1Database) {
  return new Kysely<DB>({
    dialect: new D1Dialect({ database: d1 }),
  })
}

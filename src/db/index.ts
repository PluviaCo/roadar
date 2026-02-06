import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import type { DB } from './types'
import type { D1Database } from '@cloudflare/workers-types'

export function getDb(dbBinding: D1Database) {
  return new Kysely<DB>({
    dialect: new D1Dialect({ database: dbBinding }),
  })
}

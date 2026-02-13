import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { getAllRegions } from '@/db/regions'
import { getDb } from '@/db'

export const fetchRegions = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb((env as any).DB)

    return await getAllRegions(db)
  },
)

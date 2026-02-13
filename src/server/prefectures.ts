import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { getAllPrefectures } from '@/db/prefectures'
import { getDb } from '@/db'

export const fetchPrefectures = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = getDb((env as any).DB)

    return await getAllPrefectures(db)
  },
)

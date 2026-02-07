import type { Kysely } from 'kysely'
import type { DB } from './types'
import type { Route } from './routes'

export async function toggleSaved(
  db: Kysely<DB>,
  userId: number,
  routeId: number,
): Promise<boolean> {
  // Check if saved route exists
  const existing = await db
    .selectFrom('saved_routes')
    .select('id')
    .where('user_id', '=', userId)
    .where('route_id', '=', routeId)
    .executeTakeFirst()

  if (existing) {
    // Remove saved route
    await db
      .deleteFrom('saved_routes')
      .where('user_id', '=', userId)
      .where('route_id', '=', routeId)
      .execute()
    return false
  } else {
    // Add saved route
    await db
      .insertInto('saved_routes')
      .values({
        user_id: userId,
        route_id: routeId,
      })
      .execute()
    return true
  }
}

export async function getSavedRoutes(
  db: Kysely<DB>,
  userId: number,
): Promise<Array<Route>> {
  const { getAllRoutes } = await import('./routes')

  // Get all routes with user context to mark saved status
  const allRoutes = await getAllRoutes(db, userId)

  // Filter only saved routes
  return allRoutes.filter((route) => route.isSaved)
}

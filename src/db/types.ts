import type { ColumnType, Generated } from 'kysely'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface UsersTable {
  id: Generated<number>
  name: string
  email: string | null
  picture_url: string | null
  updated_at: ColumnType<Date, Date | string | undefined, never>
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface LineUsersTable {
  id: Generated<number>
  user_id: number
  line_user_id: string
  updated_at: ColumnType<Date, Date | string | undefined, never>
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface RoutesTable {
  id: Generated<number>
  name: string
  coordinates: string // JSON string
  updated_at: ColumnType<Date, Date | string | undefined, never>
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface PhotosTable {
  id: Generated<number>
  route_id: number
  user_id: number | null
  url: string
  updated_at: ColumnType<Date, Date | string | undefined, never>
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface SavedRoutesTable {
  id: Generated<number>
  user_id: number
  route_id: number
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface DB {
  users: UsersTable
  line_users: LineUsersTable
  routes: RoutesTable
  photos: PhotosTable
  saved_routes: SavedRoutesTable
}

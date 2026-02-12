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

export interface PrefecturesTable {
  id: number
  name: string
  region: string
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface RoutesTable {
  id: Generated<number>
  name: string
  description: string | null
  coordinates: string // JSON string
  user_id: number | null // NULL for system routes, populated for user-created routes
  is_public: boolean
  distance: number | null // Distance in meters from Google Maps API
  duration: number | null // Duration in seconds from Google Maps API
  prefecture_id: number
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

export interface TripsTable {
  id: Generated<number>
  user_id: number
  route_id: number | null
  title: string
  notes: string | null
  coordinates: string // JSON string
  date: ColumnType<Date, Date | string, Date | string>
  rating: number | null // 1-5 stars
  created_at: ColumnType<Date, Date | string | undefined, never>
  updated_at: ColumnType<Date, Date | string | undefined, never>
}

export interface TripPhotosTable {
  id: Generated<number>
  trip_id: number
  url: string
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface TripLikesTable {
  id: Generated<number>
  user_id: number
  trip_id: number
  created_at: ColumnType<Date, Date | string | undefined, never>
}

export interface DB {
  users: UsersTable
  line_users: LineUsersTable
  routes: RoutesTable
  prefectures: PrefecturesTable
  photos: PhotosTable
  saved_routes: SavedRoutesTable
  trips: TripsTable
  trip_photos: TripPhotosTable
  trip_likes: TripLikesTable
}

import type { ColumnType, Generated } from 'kysely'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface UsersTable {
  id: Generated<number>
  name: string
  email: string | null
  picture_url: string | null
  updated_at: ColumnType<Timestamp, Timestamp, never>
  created_at: ColumnType<Timestamp, Timestamp, never>
}

export interface LineUsersTable {
  id: Generated<number>
  user_id: number
  line_user_id: string
  updated_at: ColumnType<Timestamp, Timestamp, never>
  created_at: ColumnType<Timestamp, Timestamp, never>
}

export interface DB {
  users: UsersTable
  line_users: LineUsersTable
}

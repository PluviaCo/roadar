'use server'

import { useSession } from '@tanstack/react-start/server'

export type SessionData = {
  id: number
  email: string
}

export function useAppSession() {
  return useSession<SessionData>({
    password:
      process.env.SESSION_SECRET || 'a-very-long-secret-password-32-chars-min',
    name: 'session',
  })
}

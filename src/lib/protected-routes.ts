import { redirect } from '@tanstack/react-router'

export function createProtectedRoute() {
  return {
    beforeLoad: async ({ context }) => {
      if (!context.user) {
        throw redirect({ to: '/signin' })
      }
    },
  }
}

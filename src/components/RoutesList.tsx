import { Stack } from '@mui/material'
import { RouteCard } from './RouteCard'
import type { Route } from '@/db/routes'

interface RoutesListProps {
  routes: Array<Route>
  savedRoutes: Record<string, boolean>
  user: any
  onSaveClick: (e: React.MouseEvent, routeId: string) => void
}

export function RoutesList({
  routes,
  savedRoutes,
  user,
  onSaveClick,
}: RoutesListProps) {
  return (
    <Stack spacing={2}>
      {routes.map((route) => (
        <RouteCard
          key={route.id}
          route={route}
          isSaved={savedRoutes[route.id]}
          showSaveButton={!!user}
          onSaveClick={onSaveClick}
        />
      ))}
    </Stack>
  )
}

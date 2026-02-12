# Development Conventions

This document outlines the architectural decisions and conventions for this project.

## Directory Structure

### `/src/db/` - Database Access Layer

**Purpose:** Contains pure database operations using Kysely ORM.

**Rules:**

- ❌ NO `createServerFn` calls
- ❌ NO authentication/session checks
- ❌ NO environment access (cloudflare:workers)
- ✅ Pure database functions using Kysely
- ✅ Type definitions (types.ts)
- ✅ Accept `db: Kysely<DB>` as parameter
- ✅ Accept `userId` as explicit parameter when needed

**Example:**

```typescript
// ✅ Good - Pure database function
export async function toggleSaved(
  db: Kysely<DB>,
  userId: number,
  routeId: number,
): Promise<boolean> {
  const existing = await db.selectFrom('saved_routes')
  // ... rest of query
}
```

---

### `/src/server/` - Server Functions Layer

**Purpose:** Contains TanStack Start server functions that handle HTTP requests.

**Rules:**

- ✅ Use `createServerFn` for defining server functions
- ✅ Handle authentication/session validation
- ✅ Access environment variables (cloudflare:workers)
- ✅ Call database functions from `/src/db/`
- ✅ Perform business logic validation
- ❌ NO direct SQL queries (delegate to /src/db/)

**Example:**

```typescript
// ✅ Good - Server function that uses DB layer
export const toggleSavedRoute = createServerFn({ method: 'POST' })
  .inputValidator((data: { routeId: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.id) {
      throw new Error('Unauthorized')
    }

    const db = getDb((env as any).DB)
    const isSaved = await toggleSaved(db, session.data.id, Number(data.routeId))
    return { isSaved }
  })
```

---

## Why This Separation?

**Three-Layer Architecture:**

1. **Routes Layer** (`/src/routes/`) - Routing & UI
2. **Server Layer** (`/src/server/`) - Authentication & Business Logic
3. **Database Layer** (`/src/db/`) - Data Access

**Benefits:**

1. **Testability**: Database functions can be tested independently without mocking server context
2. **Reusability**: DB functions can be called from multiple server functions or scripts
3. **Clear Boundaries**: UI (routes) → Business logic (server) → Data access (db)
4. **Maintainability**: Changes to authentication don't affect database logic
5. **Clean Route Files**: Routes focus on routing and rendering, not data fetching implementation

---

## Database Conventions

### Migrations

- All migrations in `/migrations/` folder
- Use `npm run migrate` to apply migrations
- Use `npm run migrate:reset` to reset and reapply (local dev only)
- Update initial migration file `0001_initial_schema.sql` for new tables during development
- **Don't create separate migration files during early development**

### Naming

- Tables: `snake_case` (e.g., `saved_routes`, `line_users`)
- TypeScript interfaces: `PascalCase` + `Table` suffix (e.g., `SavedRoutesTable`)
- Foreign keys: Use `ON DELETE CASCADE` or `ON DELETE SET NULL` appropriately
- Always add indexes for foreign key columns

### Seed Data

- Seed script: `scripts/seed-local.ts`
- Run with: `npm run seed`
- Batches all SQL statements for performance
- Creates test user with id=1 for local development

---

## Route Conventions

### Photo Serving

- Photos uploaded to R2 storage
- Served via `/photos/*` route (splat route in `src/routes/photos/$.ts`)
- URLs stored in database as relative paths: `/photos/routes/{routeId}/{userId}_{timestamp}.{ext}`
- Works for both local and production without external domain

### Server Routes

- Use `server.handlers.GET/POST` for API endpoints
- Use dynamic imports for cloudflare:workers binding
- Extract params from `params` object or `request.url`

### Route Files (`/src/routes/`)

**Purpose:** Define routes, loaders, and UI components only.

**Rules:**

- ❌ NO inline `createServerFn` definitions in route files
- ❌ NO database access or authentication logic
- ✅ Import server functions from `/src/server/`
- ✅ Define route configuration (loader, component, errorComponent)
- ✅ UI component logic and state management
- ✅ Call server functions in loaders or event handlers

**Example:**

```typescript
// ✅ Good - Route file imports server function
import { fetchRoutes } from '@/server/routes'
import { toggleSavedRoute } from '@/server/saved-routes'

export const Route = createFileRoute('/routes/')({
  loader: async () => {
    return await fetchRoutes()
  },
  component: RoutesListComponent,
})

function RoutesListComponent() {
  const routes = Route.useLoaderData()
  // ... component logic
}
```

```typescript
// ❌ Bad - Inline server function in route file
const fetchRoutes = createServerFn({ method: 'GET' }).handler(async () => {
  const { env } = await import('cloudflare:workers')
  // ... this belongs in /src/server/
})
```

---

## UI Conventions

### Icons

- Saved routes: Heart icon (❤️) - `<Favorite />` / `<FavoriteBorder />`
- Photos: Upload cloud icon - `<CloudUpload />`

### Responsive Design

- Always include viewport meta tag in root layout
- Use Material-UI's `sx` prop with responsive breakpoints: `{ xs: value, md: value }`
- Mobile-first approach: stack vertically on mobile, horizontal on desktop

---

## Server Function Patterns

### Authentication Required

```typescript
const session = await useAppSession()
if (!session.data.id) {
  throw new Error('Unauthorized')
}
```

### File Upload Serialization

Files cannot be serialized directly. Convert to arrays:

```typescript
// Client side
const arrayBuffer = await file.arrayBuffer()
const uint8Array = Array.from(new Uint8Array(arrayBuffer))

// Server side
const uint8Array = new Uint8Array(data.fileData)
```

---

## Context Access

### User Context

- User data fetched in root layout's `beforeLoad`
- Access in child routes via `Route.useRouteContext()`
- Pattern:

```typescript
const { user } = Route.useRouteContext()
if (user) {
  // User is authenticated
}
```

---

_Last updated: 2026-02-07_

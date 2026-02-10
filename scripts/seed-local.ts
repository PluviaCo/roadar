import { execSync } from 'node:child_process'

const mockRoutes = [
  {
    name: 'Downtown Loop',
    description:
      'A scenic route through the heart of downtown, perfect for exploring the city center.',
    coordinates: [
      { lat: 35.6762, lng: 139.6503 },
      { lat: 35.6795, lng: 139.655 },
      { lat: 35.685, lng: 139.653 },
      { lat: 35.688, lng: 139.649 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
      'https://placehold.co/600x400?text=Photo+3',
    ],
    duration: 900, // 15 min in seconds
    distance: 3200, // 3.2 km in meters
  },
  {
    name: 'Airport Express',
    description:
      'Quick and efficient route connecting the city to the airport with minimal stops.',
    coordinates: [
      { lat: 35.5494, lng: 139.7798 },
      { lat: 35.555, lng: 139.775 },
      { lat: 35.56, lng: 139.77 },
      { lat: 35.565, lng: 139.765 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
    ],
    duration: 1320, // 22 min in seconds
    distance: 5500, // 5.5 km in meters
  },
  {
    name: 'Waterfront Route',
    description:
      'Beautiful coastal drive with stunning ocean views and fresh sea breeze.',
    coordinates: [
      { lat: 35.6555, lng: 139.758 },
      { lat: 35.66, lng: 139.762 },
      { lat: 35.665, lng: 139.765 },
      { lat: 35.67, lng: 139.77 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
      'https://placehold.co/600x400?text=Photo+3',
    ],
    duration: 1740, // 29 min in seconds
    distance: 8000, // 8.0 km in meters
  },
  {
    name: 'Suburban Connector',
    description:
      'Peaceful suburban route connecting residential areas with local amenities.',
    coordinates: [
      { lat: 35.72, lng: 139.63 },
      { lat: 35.725, lng: 139.635 },
      { lat: 35.73, lng: 139.64 },
      { lat: 35.735, lng: 139.645 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
    ],
    duration: 2160, // 36 min in seconds
    distance: 10500, // 10.5 km in meters
  },
  {
    name: 'Shopping District',
    description:
      'Navigate through trendy shopping areas and popular retail destinations.',
    coordinates: [
      { lat: 35.665, lng: 139.7 },
      { lat: 35.67, lng: 139.705 },
      { lat: 35.675, lng: 139.71 },
      { lat: 35.68, lng: 139.715 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
      'https://placehold.co/600x400?text=Photo+3',
    ],
    duration: 2580, // 43 min in seconds
    distance: 13000, // 13.0 km in meters
  },
  {
    name: 'University Shuttle',
    description:
      'Convenient route connecting campus buildings and student housing areas.',
    coordinates: [
      { lat: 35.71, lng: 139.76 },
      { lat: 35.715, lng: 139.755 },
      { lat: 35.72, lng: 139.75 },
      { lat: 35.725, lng: 139.745 },
    ],
    photos: ['https://placehold.co/600x400?text=Photo+1'],
    duration: 3000, // 50 min in seconds
    distance: 15500, // 15.5 km in meters
  },
  {
    name: 'Business Park Loop',
    description:
      'Efficient loop serving major office buildings and business centers.',
    coordinates: [
      { lat: 35.63, lng: 139.73 },
      { lat: 35.635, lng: 139.735 },
      { lat: 35.64, lng: 139.74 },
      { lat: 35.645, lng: 139.735 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
      'https://placehold.co/600x400?text=Photo+3',
    ],
    duration: 3420, // 57 min in seconds
    distance: 18000, // 18.0 km in meters
  },
  {
    name: 'Harbor Transit',
    description:
      'Scenic harbor route with views of boats, ships, and maritime activities.',
    coordinates: [
      { lat: 35.645, lng: 139.77 },
      { lat: 35.65, lng: 139.775 },
      { lat: 35.655, lng: 139.78 },
      { lat: 35.66, lng: 139.785 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
      'https://placehold.co/600x400?text=Photo+3',
      'https://placehold.co/600x400?text=Photo+4',
      'https://placehold.co/600x400?text=Photo+5',
    ],
    duration: 3840, // 64 min in seconds
    distance: 20500, // 20.5 km in meters
  },
  {
    name: 'Historic District Tour',
    description:
      'Explore historical landmarks and cultural sites throughout the old city.',
    coordinates: [
      { lat: 35.69, lng: 139.72 },
      { lat: 35.695, lng: 139.725 },
      { lat: 35.7, lng: 139.73 },
      { lat: 35.705, lng: 139.725 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
      'https://placehold.co/600x400?text=Photo+3',
    ],
    duration: 4260, // 71 min in seconds
    distance: 23000, // 23.0 km in meters
  },
  {
    name: 'Park Circuit',
    description:
      'Relaxing route winding through green spaces, gardens, and recreational areas.',
    coordinates: [
      { lat: 35.59, lng: 139.66 },
      { lat: 35.595, lng: 139.665 },
      { lat: 35.6, lng: 139.67 },
      { lat: 35.605, lng: 139.675 },
    ],
    photos: [
      'https://placehold.co/600x400?text=Photo+1',
      'https://placehold.co/600x400?text=Photo+2',
      'https://placehold.co/600x400?text=Photo+3',
    ],
    duration: 4680, // 78 min in seconds
    distance: 25500, // 25.5 km in meters
  },
]

console.log('Starting database seed...')

// Build SQL commands
console.log('Building SQL statements...')
const sqlStatements = [
  'DELETE FROM photos;',
  'DELETE FROM routes;',
  'DELETE FROM line_users;',
  'DELETE FROM users;',
  // Create a test user
  `INSERT INTO users (id, name, email, picture_url, created_at, updated_at) VALUES (1, 'Test User', 'test@example.com', 'https://placehold.co/100x100', datetime('now'), datetime('now'));`,
]

// Add insert statements for routes and photos
let routeId = 1
for (const route of mockRoutes) {
  const coordsJson = JSON.stringify(route.coordinates).replace(/'/g, "''")
  const name = route.name.replace(/'/g, "''")
  const description = route.description
    ? route.description.replace(/'/g, "''")
    : null

  sqlStatements.push(
    `INSERT INTO routes (id, name, description, coordinates, duration, distance, updated_at, created_at) VALUES (${routeId}, '${name}', ${description ? `'${description}'` : 'NULL'}, '${coordsJson}', ${route.duration}, ${route.distance}, datetime('now'), datetime('now'));`,
  )

  for (const photoUrl of route.photos) {
    const url = photoUrl.replace(/'/g, "''")
    sqlStatements.push(
      `INSERT INTO photos (route_id, user_id, url, updated_at, created_at) VALUES (${routeId}, 1, '${url}', datetime('now'), datetime('now'));`,
    )
  }

  routeId++
}

// Write to temporary file
const { writeFileSync, unlinkSync } = await import('node:fs')
const { join } = await import('node:path')
const tmpFile = join(process.cwd(), '.seed-tmp.sql')
writeFileSync(tmpFile, sqlStatements.join('\n'))

try {
  console.log(`Executing ${sqlStatements.length} SQL statements...`)
  execSync(`npx wrangler d1 execute roadar-db --local --file=${tmpFile}`, {
    stdio: 'inherit',
  })
  console.log(`✓ Successfully seeded ${mockRoutes.length} routes`)
} finally {
  unlinkSync(tmpFile)
}

console.log('Database seeding completed successfully!')

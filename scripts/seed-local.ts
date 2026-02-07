import { execSync } from 'node:child_process'

const mockRoutes = [
  {
    name: 'Downtown Loop',
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
  },
  {
    name: 'Airport Express',
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
  },
  {
    name: 'Waterfront Route',
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
  },
  {
    name: 'Suburban Connector',
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
  },
  {
    name: 'Shopping District',
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
  },
  {
    name: 'University Shuttle',
    coordinates: [
      { lat: 35.71, lng: 139.76 },
      { lat: 35.715, lng: 139.755 },
      { lat: 35.72, lng: 139.75 },
      { lat: 35.725, lng: 139.745 },
    ],
    photos: ['https://placehold.co/600x400?text=Photo+1'],
  },
  {
    name: 'Business Park Loop',
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
  },
  {
    name: 'Harbor Transit',
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
  },
  {
    name: 'Historic District Tour',
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
  },
  {
    name: 'Industrial Zone Express',
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
  },
]

console.log('Starting database seed...')

// Build SQL commands
console.log('Building SQL statements...')
const sqlStatements = ['DELETE FROM photos;', 'DELETE FROM routes;']

// Add insert statements for routes and photos
let routeId = 1
for (const route of mockRoutes) {
  const coordsJson = JSON.stringify(route.coordinates).replace(/'/g, "''")
  const name = route.name.replace(/'/g, "''")

  sqlStatements.push(
    `INSERT INTO routes (id, name, coordinates, updated_at, created_at) VALUES (${routeId}, '${name}', '${coordsJson}', datetime('now'), datetime('now'));`,
  )

  for (const photoUrl of route.photos) {
    const url = photoUrl.replace(/'/g, "''")
    sqlStatements.push(
      `INSERT INTO photos (route_id, url, updated_at, created_at) VALUES (${routeId}, '${url}', datetime('now'), datetime('now'));`,
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

export interface RouteCoordinate {
  lat: number
  lng: number
}

export interface Route {
  id: string
  name: string
  coordinates: Array<RouteCoordinate>
  photos: Array<string>
}

const mockRoutes: Array<Route> = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
    id: '8',
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
    id: '9',
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
    id: '10',
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

export async function getAllRoutes(): Promise<Array<Route>> {
  return mockRoutes
}

export async function getRouteById(id: string): Promise<Route | undefined> {
  return mockRoutes.find((route) => route.id === id)
}

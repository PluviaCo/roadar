import { createFileRoute } from '@tanstack/react-router'
import { Stack, Typography } from '@mui/material'
import z from 'zod'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import RoutePlotter from '@/components/RoutePlotter'

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    count: z.number().optional(),
  }),
  component: RouteComponent,
})

const position = { lat: 35.3606, lng: 138.7274 } // Example coordinates

function RouteComponent() {
  const [stops, setStops] = useState([
    { lat: 35.6895, lng: 139.6917 }, // Tokyo
    { lat: 35.4875, lng: 138.8417 }, // Fujiyoshida (Mt. Fuji area)
    { lat: 35.0116, lng: 135.7681 }, // Kyoto
  ])
  return (
    <Stack alignItems="center">
      <Typography variant="h1" marginBlockEnd={4}>
        Hello world!
      </Typography>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <div style={{ height: '100vh', width: '100%' }}>
          <Map defaultCenter={position} defaultZoom={7}>
            <Marker position={position} />
            <RoutePlotter points={stops} />
          </Map>
        </div>
      </APIProvider>
    </Stack>
  )
}

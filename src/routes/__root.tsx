/// <reference types="vite/client" />
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { CacheProvider } from '@emotion/react'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import createCache from '@emotion/cache'
import fontsourceVariableRobotoCss from '@fontsource-variable/roboto?url'
import React from 'react'
import { createServerFn } from '@tanstack/react-start'
import { theme } from '@/setup/theme'
import { Header } from '@/components/Header'
import { SnackbarProvider } from '@/components/SnackbarProvider'
import { useAppSession } from '@/lib/session'
import { Footer } from '@/components/Footer'

const fetchUser = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await useAppSession()

  if (!session.data.id) {
    return null
  }

  const { getUser } = await import('@/db/users')
  const { env } = await import('cloudflare:workers')

  const db = (env as any).DB
  const user = await getUser(db, session.data.id)

  return {
    id: user.id,
    email: user.email || undefined,
    name: user.name,
    picture_url: user.picture_url || undefined,
  }
})

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await fetchUser()

    return {
      user,
    }
  },
  loader: ({ context }) => {
    return context.user
  },
  head: () => ({
    meta: [
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'stylesheet', href: fontsourceVariableRobotoCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: 'css' })

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <SnackbarProvider>
          <Providers>
            <Header />

            <Container component="main" sx={{ paddingBlock: 4 }}>
              {children}
            </Container>

            <Footer />
          </Providers>
        </SnackbarProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

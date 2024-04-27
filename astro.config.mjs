import 'dotenv/config'
import { defineConfig } from 'astro/config'

/* Adapter */
import node from '@astrojs/node'

/* Integrations */
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'
import sentry from '@sentry/astro'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://creatorsgarten.org',
  adapter: node({
    mode: 'middleware',
  }),
  prefetch: true,
  integrations: [
    tailwind(),
    react(),
    svelte(),
    sentry({
      dsn: 'https://df2948d525ea90ca0a620e1b6d6c083e@o4506355720323072.ingest.sentry.io/4506355722354688',
      sourceMapsUploadOptions: {
        project: 'website',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
  vite: {
    build: {
      rollupOptions: {
        onwarn: ({ message, code, ids }) => {
          if (
            [
              'Module level directives cause errors when bundled, "use client"',
            ].some(o => message.includes(o)) ||
            (code === 'CIRCULAR_DEPENDENCY' &&
              ids.every(id => id.includes('node_modules/.pnpm')))
          )
            return
          console.error(message)
        },
      },
    },
  },
})

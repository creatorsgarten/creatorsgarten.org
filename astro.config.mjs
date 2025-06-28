import { defineConfig, envField } from 'astro/config'
import 'dotenv/config'

/* Adapter */
import node from '@astrojs/node'

/* Integrations */
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import sentry from '@sentry/astro'

/* Vite Plugins */
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://creatorsgarten.org',
  adapter: node({
    mode: 'middleware',
  }),
  prefetch: true,
  env: {
    schema: {
      // Backend URLs
      BACKEND_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
      }),
      CONTENT_API_URL: envField.string({
        context: 'server',
        access: 'public',
        default: 'https://wiki.creatorsgarten.org',
      }),
      G0_HOSTNAME: envField.string({ context: 'server', access: 'secret' }),

      // API Credentials
      RIFFY_API_CREDENTIALS: envField.string({
        context: 'server',
        access: 'secret',
      }),
      G0_CREDENTIALS: envField.string({ context: 'server', access: 'secret' }),

      // Discord
      DISCORD_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DISCORD_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),
      DISCORD_NOTIFY_WEBHOOK_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),

      // GitHub
      GITHUB_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      GITHUB_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),

      // Google
      GOOGLE_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),

      // Figma
      FIGMA_CLIENT_ID: envField.string({ context: 'server', access: 'secret' }),
      FIGMA_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),

      // Eventpop
      EVENTPOP_CLIENT_ID: envField.string({
        context: 'server',
        access: 'secret',
      }),
      EVENTPOP_CLIENT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
      }),

      // Database
      MONGO_USER: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      MONGO_PASS: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      MONGO_ADDRESS: envField.string({ context: 'server', access: 'secret' }),

      // Security
      CSRF_SECRET: envField.string({ context: 'server', access: 'secret' }),
      JWT_PRIVATE_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),

      // Sentry
      SENTRY_AUTH_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  integrations: [
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
  security: {
    checkOrigin: false,
  },
  vite: {
    plugins: [tailwindcss()],
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

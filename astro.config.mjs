import { defineConfig } from 'astro/config'

/* Adapter */
import node from '@astrojs/node'
import react from '@astrojs/react'

/* Integrations */
import tailwind from '@astrojs/tailwind'
import prefetch from '@astrojs/prefetch'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://creatorsgarten.org',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [tailwind(), prefetch(), react()],
})

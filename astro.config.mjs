import { defineConfig } from 'astro/config'

/* Adapter */
import node from '@astrojs/node'
import react from '@astrojs/react'

/* Integrations */
import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import prefetch from '@astrojs/prefetch'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind(),
    image(),
    prefetch(),
    react(),
  ],
})

import { defineConfig } from 'astro/config'

/* Adapter */
import node from '@astrojs/node'

/* Integrations */
import prefetch from '@astrojs/prefetch'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://creatorsgarten.org',
  adapter: node({
    mode: 'middleware',
  }),
  integrations: [tailwind(), prefetch(), react(), svelte()],
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

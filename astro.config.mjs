import { defineConfig } from 'astro/config'

/* Adapter */
import node from '@astrojs/node'

/* Integrations */
import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import prefetch from '@astrojs/prefetch'
import compress from 'astro-compress'

/* Markdown plugins */
import { headerPlugin } from './src/plugins/headerPlugin.mjs'
import externalLinks from 'remark-external-links'
import sectionize from 'remark-sectionize'

// https://astro.build/config
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind(),
    image(),
    mdx(),
    prefetch(),
    compress({
      img: false,
      svg: false,
      js: true,
    }),
    react(),
  ],
  markdown: {
    remarkPlugins: [externalLinks, sectionize, headerPlugin],
  },
})

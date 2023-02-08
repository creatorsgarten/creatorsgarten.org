import { defineConfig } from 'astro/config'

import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import prefetch from '@astrojs/prefetch'
import compress from 'astro-compress'

import { headerPlugin } from './src/plugins/headerPlugin.mjs'

// https://astro.build/config
export default defineConfig({
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
  ],
  markdown: {
    remarkPlugins: [headerPlugin],
  },
})

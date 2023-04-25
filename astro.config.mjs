import { defineConfig } from 'astro/config'

import node from '@astrojs/node'

import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import prefetch from '@astrojs/prefetch'
import compress from 'astro-compress'

import externalLinks from 'remark-external-links'
import sectionize from 'remark-sectionize'
import { headerPlugin } from './src/plugins/headerPlugin.mjs'

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
  ],
  markdown: {
    remarkPlugins: [externalLinks, sectionize, headerPlugin],
  },
})

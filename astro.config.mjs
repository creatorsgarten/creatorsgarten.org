import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import prefetch from '@astrojs/prefetch';
import compress from 'astro-compress'

import { remarkPlugins } from './src/plugins/remark.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), image(), mdx(), prefetch(), compress({
    img: false,
    svg: false,
    js: true,
  })],
  markdown: {
    remarkPlugins,
  },
  vite: {
    ssr: {
      external: ['prismjs', '@astrojs/markdown-remark']
    }
  }
});

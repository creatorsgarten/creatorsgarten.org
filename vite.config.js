import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['p-memoize', 'devalue', 'mimic-fn']
  }
};

export default config;

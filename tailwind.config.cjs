const defaultConfig = require('tailwindcss/defaultConfig')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Work Sans', ...defaultConfig.theme.fontFamily.sans],
        casual: [
          ['RecursiveVariable', ...defaultConfig.theme.fontFamily.sans],
          { fontVariationSettings: '"CASL" 1, "CRSV" 1, "slnt" 0, "MONO" 0' },
        ],
        mono: [
          ['RecursiveVariable', ...defaultConfig.theme.fontFamily.mono],
          { fontVariationSettings: '"CASL" 0, "CRSV" 0, "slnt" 0, "MONO" 1' },
        ],
      },
      animation: {
        loader: 'loader 0.6s infinite alternate',
      },
      keyframes: {
        loader: {
          to: {
            opacity: 0.1,
            transform: 'translate3d(0, -1rem, 0)',
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-links': colors.blue[500],
            a: {
              fontFamily: 'RecursiveVariable',
              textDecoration: 'none',
              fontWeight: 'inherit',
            },
            // Remove Comments for ความกระตุกจิตกระชากใจ
            code: {
              fontVariationSettings: '"CASL" 0, "CRSV" 0, "slnt" 0, "MONO" 1',
            },
            h1: {
              fontWeight: 500,
              marginTop: '3rem',
              marginBottom: '0.5em',
            },
            h2: {
              fontWeight: 500,
              marginBottom: '0.67em',
            },
            'h1+h2': {
              marginTop: '1em',
            },
            details: {
              backgroundColor: colors.gray[50],
              marginTop: '1.25em',
              marginBottom: '1.25em',
              padding: '0.5rem',
            },
            summary: {
              backgroundColor: colors.gray[100],
              margin: '-0.5rem -0.5rem 0',
              padding: '0.5rem',
              cursor: 'pointer',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

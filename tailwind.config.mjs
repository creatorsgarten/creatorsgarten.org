import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cg: '#449388',
        cy: '#E1AD6A',
        cb: '#3C7ADF',
        cp: '#CE90B8',
        co: '#DF5D2F',
        ck: '#1C1916',
        cw: '#EDE5DA',
        cbr: '#635548',
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
            // Remove Comments for ความกระตุกจิตกระชากใจ
            code: {
              fontVariationSettings: '"CASL" 0, "CRSV" 0, "slnt" 0, "MONO" 1',
            },
            h1: {
              fontSize: '1.75rem',
              fontWeight: 500,
              marginTop: '3rem',
              marginBottom: '0.5em',
            },
            h2: {
              fontSize: '1.5rem',
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
            strong: {
              fontWeight: 500,
            },
            table: {
              fontSize: '0.95rem',
            },
            li: {
              fontSize: '1rem',
            },
            a: {
              textDecoration: 'none',
              fontWeight: 'inherit',
              color: colors.blue[600],
            },
            p: {
              fontSize: '1rem',
            },
            '.lead > p': {
              fontSize: '1.15rem',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

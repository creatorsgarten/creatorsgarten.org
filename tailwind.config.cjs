const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
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
        lg: {
          css: {
            lineHeight: '1.555555',
          },
        },
        DEFAULT: {
          css: {
            '--tw-prose-links': colors.sky[600],
            a: {
              textDecoration: 'none',
              fontWeight: 'inherit',
            },
            h1: {
              fontWeight: 500,
            },
            h2: {
              fontWeight: 500,
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

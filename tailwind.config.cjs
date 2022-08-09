const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        loader: 'loader 0.6s infinite alternate'
      },
      keyframes: {
        loader: {
          to: {
            opacity: 0.1,
            transform: 'translate3d(0, -1rem, 0)'
          }
        }
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
              fontWeight: 'inherit'
            },
            h1: {
              fontWeight: 00,
            },
            h2: {
              fontWeight: 600,
            },
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

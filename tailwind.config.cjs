const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
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

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      typography: {
        lg: {
          css: {
            lineHeight: '1.555555'
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};

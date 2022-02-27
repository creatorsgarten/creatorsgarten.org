const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Space Grotesk', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
}

const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		container: {},
		extend: {
			fontFamily: {
				inter: ['var(--font-inter)', ...fontFamily.sans],
			},
		},
	},
	plugins: [],
};

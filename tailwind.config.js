/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			scrollbar: {
				width: '8px',
				track: 'bg-gray-500',
				thumb: 'bg-gray-800',
				radius: '4px',
			},
		},
	},
	plugins: [],
};

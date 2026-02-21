/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#ff6b6b",
				secondary: "#ffd93d",
				dark: {
					DEFAULT: "#1a1a2e",
					lighter: "#16213e",
				},
			},
			animation: {
				flicker: "flicker 2s ease-in-out infinite",
				blow: "blow 1s ease-out forwards",
				shine: "shine 3s linear infinite",
			},
			keyframes: {
				flicker: {
					"0%, 100%": { opacity: "1", transform: "scale(1)" },
					"50%": { opacity: "0.8", transform: "scale(0.95)" },
				},
				blow: {
					"0%": { transform: "scale(1)", opacity: "1" },
					"100%": { transform: "scale(0)", opacity: "0" },
				},
				shine: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
			},
		},
	},
	plugins: [],
};

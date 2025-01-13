/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#fef3c7", // Varm gul
          DEFAULT: "#84cc16", // Mossgrönt
          dark: "#365314", // Mörkgrön
        },
        accent: {
          light: "#fde68a", // Gyllene
          DEFAULT: "#d97706", // Varm brun
          dark: "#78350f", // Mörkbrun
        },
        forest: {
          light: "#dcfce7", // Ljus skogsgrön
          DEFAULT: "#22c55e", // Frisk grön
          dark: "#14532d", // Djup skogsgrön
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
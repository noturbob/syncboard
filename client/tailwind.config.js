// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#18152e',       // Dark deep blue/purple background
        secondary: '#241f3e',     // Slightly lighter background for sections/cards
        accent: '#a382ff',        // Primary accent color (light purple/lavender)
        'accent-dark': '#8b5cf6', // Stronger purple, good for buttons/highlights
        highlight: '#f3f4f6',     // White/Light text
        subtle: '#d1d5db',        // Lighter text for subtitles/descriptions
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming you'll import Inter from Google Fonts
      },
      animation: {
        'aurora': 'aurora 60s linear infinite', // For the background animation
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite', // Slower ping for visual effects
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
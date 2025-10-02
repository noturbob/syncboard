/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1a1a2e',
        'secondary': '#16213e',
        'accent': '#9f7aea',
        'highlight': '#f7fafc',
        'subtle': '#a0aec0',
      },
      animation: {
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        aurora: { /* ... */ },
      },
      // --- Add these new properties ---
      backgroundImage: {
        'dotted-pattern': "radial-gradient(#d7d7d7 1px, transparent 1px)",
      },
      backgroundSize: {
        'dotted-size': '16px 16px',
      },
      // ---------------------------------
    },
  },
  plugins: [],
};
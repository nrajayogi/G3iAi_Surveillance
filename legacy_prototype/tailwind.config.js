/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'army-green': '#1a2e1a',
        'neon-cyan': '#00ffcc',
        'alert-red': '#ff3333',
        'dark-panel': '#0f172a',
      },
    }
  },
  plugins: [],
}

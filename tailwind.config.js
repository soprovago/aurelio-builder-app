/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff1b6d',
        'wemax-dark': '#000000',
        'wemax-surface': '#1e1e1e',
        'wemax-card': '#252525',
        'wemax-border': '#3a3a3a',
      },
    },
  },
  plugins: [],
}


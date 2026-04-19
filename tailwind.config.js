/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['selector', '.dark'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#1a1a1a',
          card: '#242424',
          border: '#333333',
          text: '#e5e5e5',
          muted: '#888888',
        },
      },
    },
  },
  plugins: [],
}

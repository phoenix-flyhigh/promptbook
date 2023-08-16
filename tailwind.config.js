/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-orange': '#FF5722',
        'dark-background': '#121212',
        'light-background':'#fff',
        'dark-title': '#a0c4ff',
        'light-title': '#000',
        'dark-subtitle':'#333',
        'light-subtitle':'#333'
      }
    },
  },
  plugins: [],
}
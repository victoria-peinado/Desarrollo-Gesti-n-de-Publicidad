/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Helvetica Neue', 'sans-serif'],
      },
      colors: {
        'pry': '#3f51b5', // Puedes utilizar cualquier código de color hexadecimal
      }
    },
  },
  plugins: [],
}


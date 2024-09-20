/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        xs:'400px',
        xxs:'250px',
        xxxs:'150px'
      }
    },
  },
  plugins: [],
}
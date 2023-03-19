/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: 'var(--font-newsreader)',
        secondary: 'var(--font-kumbh-sans)'
      },
      colors: {
        primary: '#064EA4',
        secondary1: '#E1EDFB',
        secondary2: '#FCDF69',
        secondary3: '#F99D77',
        neutral: '#0F437F',
      }
    },
  },
  plugins: [],
}
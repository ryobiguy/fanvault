/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef5ff',
          100: '#fde8ff',
          200: '#fcd1ff',
          300: '#f9a8ff',
          400: '#f570ff',
          500: '#e838f7',
          600: '#d016d8',
          700: '#ad0fb3',
          800: '#8f0d92',
          900: '#760f77',
        },
        brand: {
          pink: '#d946d8',      // Magenta/Pink from logo
          orange: '#ff6b47',    // Coral/Orange from logo
        },
      },
    },
  },
  plugins: [],
}

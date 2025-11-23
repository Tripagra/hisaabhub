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
          DEFAULT: '#D4AF37', // Gold
          hover: '#B5952F',
        },
        dark: {
          DEFAULT: '#000000', // Pure Black
          surface: '#111111', // Off-black for cards
          highlight: '#1A1A1A',
        },
        success: {
          DEFAULT: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)',
      },
    },
  },
  plugins: [],
}

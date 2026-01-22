/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Gold
          hover: '#B5952F',
          foreground: '#000000',
        },
        dark: {
          DEFAULT: '#000000', // Pure Black
          surface: '#111111', // Off-black for cards
          highlight: '#1A1A1A',
        },
        success: {
          DEFAULT: '#10B981',
        },
        background: '#000000',
        foreground: '#ffffff',
        muted: {
          DEFAULT: '#1A1A1A',
          foreground: '#A3A3A3',
        },
        border: '#1A1A1A',
        input: '#111111',
        ring: '#D4AF37',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(to right, #D4AF37, #F3E5AB, #D4AF37)',
      },
      borderRadius: {
        lg: '0.5rem',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          darkest: '#020403',      // Deep Black Green
          forest: '#02150C',       // Deep Forest
          primary: '#03281A',      // Primary Forest Green
          rich: '#063A20',         // Rich Green
          accent: '#07552B',       // Accent Green
          olive: '#697057',        // Muted Olive
          offwhite: '#F4F6F3',     // Off White light background
          purewhite: '#FFFFFF',
          border: 'rgba(7, 85, 43, 0.18)',
          card: '#0a1d14',
          cardlight: '#ffffff',
          charcoal: '#111814',
        }
      },
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

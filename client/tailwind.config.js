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
          lightbg: '#FAFCFA',      // Crisp light canvas
          lightcard: '#FFFFFF',    // Clean white cards
          lightborder: '#E2EBE5',  // Subtle green-tinted light border
          border: 'rgba(7, 85, 43, 0.16)',
          charcoal: '#111814',     // High contrast dark text
          muted: '#4B5563',        // Secondary readable text
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

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff4df0',
        'neon-blue': '#00c2ff',
        'neon-green': '#39ff14',
        'neon-yellow': '#fff95b',
        'neon-white': '#fefefe',
        'deep-gray': '#05060a',
      },
      fontFamily: {
        neon: ['"Monoton"', 'cursive'],
        techno: ['"Rajdhani"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 15px rgba(255, 77, 240, 0.8), 0 0 30px rgba(0, 194, 255, 0.6)',
      },
      dropShadow: {
        neon: '0 0 10px rgba(255, 255, 255, 0.75)',
      },
      animation: {
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px rgba(255,77,240,0.8))' },
          '50%': { opacity: 0.65, filter: 'drop-shadow(0 0 12px rgba(0,194,255,0.6))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}


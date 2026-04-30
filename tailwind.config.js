/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7f8',
          100: '#dcecee',
          500: '#1f6f7a',
          600: '#195963',
          700: '#144850',
        },
        ink: '#1d2935',
      },
      fontFamily: {
        sans: ['Trebuchet MS', 'Verdana', 'Tahoma', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px -12px rgba(28, 52, 70, 0.35)',
      },
    },
  },
  plugins: [],
}

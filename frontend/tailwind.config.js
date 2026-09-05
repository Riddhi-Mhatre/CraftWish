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
          DEFAULT: '#8B5E3C', // Warm Brown
        },
        secondary: {
          DEFAULT: '#D4A373', // Soft Beige
        },
        accent: {
          DEFAULT: '#E9C46A', // Golden Sand
        },
        background: '#FAF8F5', // Warm Cream
        card: '#FFFFFF', // White
        text: '#2D2D2D', // Dark Gray
        success: '#22C55E', // MongoDB Green
        error: '#EF4444', 
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

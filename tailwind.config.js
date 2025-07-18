/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        emoji: ['"Segoe UI Emoji"', '"Apple Color Emoji"', '"Noto Color Emoji"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

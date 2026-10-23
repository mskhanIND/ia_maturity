/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iam: {
          ink: "#181818",
          primary: "#12506E",
          "primary-dark": "#0C3A50",
          "primary-soft": "#E3EEF3",
          slate: "#5A6562",
          critical: "#B42318",
          low: "#BF530B",
          medium: "#9A6F00",
          high: "#2D7A33",
          leading: "#1C5CA3",
          line: "#D9E1E6",
          bg: "#F4F6F8",
          warn: "#FFF6E0",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        arabic: ['"IAM Arabic"', '"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

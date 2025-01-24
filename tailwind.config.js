/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(10px, -10px) rotate(10deg)" },
          "66%": { transform: "translate(-5px, 5px) rotate(-5deg)" },
          "100%": { transform: "translate(0, 0) rotate(0deg)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

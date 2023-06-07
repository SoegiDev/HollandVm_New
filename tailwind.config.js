/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 25s linear infinite",
        marquee2: "marquee2 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      screens: {
        xs: "370px",
        ...defaultTheme.screens,
      },
      colors: {
        hollandtints: {
          100: "#f9d9d3",
          200: "#f6c6bd",
          300: "#f3b3a7",
          400: "#f0a092",
          500: "#ed8d7c",
          600: "#ea7a66",
          700: "#e76650",
          800: "#e4543a",
          900: "#E24125",
        },
        hollandshades: {
          100: "#e24125",
          200: "#cb3a21",
          300: "#b4341d",
          400: "#9e2d19",
          500: "#872716",
          600: "#712012",
          700: "#5a1a0e",
          800: "#43130b",
          900: "#2d0d07",
        },
        // ...
      },
    },
  },
  corePlugins: {
    // ...
    pointerEvents: false,
  },
};

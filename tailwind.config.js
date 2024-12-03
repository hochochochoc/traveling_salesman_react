import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "h-md": { raw: "(min-height: 710px)" },
      },
      width: {
        "before-width": "var-(--tw-before-width)",
      },
      colors: {
        primary: "#F3EDE4",
        secondary: "#D9E0E4",
        tertiary: "#E9D9C8",
        egg: "#13141A",
        bluelight: "#7A9BB8",
        bluemedium: "#8BA9C2",
        bluedarkest: "#2C3E50",
        mapsblue: "#6CD2E7",
        quaternary: "#D4C5A8",
        quinary: "#C9B997",
        landing1: "#3A9DFF",
        landing2: "#1C1C20",
        landing3: "#35363E",
        maps_buttons: "#27272b",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    function ({ addBase, theme }) {
      let allColors = flattenColorPalette(theme("colors"));
      let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
      );
      addBase({
        ":root": newVars,
      });
    },
  ],
};

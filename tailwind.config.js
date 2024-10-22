/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        "before-width": "var-(--tw-before-width)",
      },
      colors: {
        // primary: "#F3F3F8",
        // secondary: "#E8DBED",
        // tertiary: "#EFC5B1",

        primary: "#F3EDE4",
        secondary: "#D9E0E4",
        tertiary: "#E9D9C8",
        // egg: "#FAF7F2",
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
      },
    },
  },
  plugins: [],
};

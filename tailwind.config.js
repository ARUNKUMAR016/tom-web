/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cutive: ["Cutive Mono", "monospace"],
      },
      colors: {
        // Base
        ivory: "#F8F4EC",
        charcoal: "#2C2C2C",

        // Brand
        brand: {
          DEFAULT: "#7A1F1F", // Temple Red
          gold: "#E3B505",
          ivory: "#F8F4EC",
          orange: "#D97706",
          teal: "#006A6A",
          leaf: "#3A5F0B",
        },

        // Neutral
        neutralc: {
          charcoal: "#2C2C2C",
          beige: "#EAD7C3",
        },
      },
    },
  },
  plugins: [],
};

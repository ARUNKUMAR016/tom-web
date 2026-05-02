/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Outfit'", "sans-serif"], // Premium Geometric Sans
        cutive: ["'Cutive Mono'", "monospace", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#D91729", // Tacos Red
          secondary: "#F4A621", // Accent Orange
          dark: "#231F20", // Charcoal Black
          cream: "#F6F0E6", // Base Cream

          // Legacy support (mapping new values where appropriate or keeping if needed)
          ink: "#231F20",
          accent: "#F4A621",
          muted: "#728175",
          temple: "#D91729",
          gold: "#E3B505",
          orange: "#D97706",
        },
        neutral: {
          ivory: "#F6F0E6", // Updated to new Cream
          charcoal: "#231F20",
          paper: "#F5F1E7",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "slow-spin": "spin 12s linear infinite",
        float: "float 6s ease-in-out infinite",
        grain: "grain 8s steps(10) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Oswald", "sans-serif"], // For bold headings (Tacos style)
        cutive: ["Cutive Mono", "monospace", "sans-serif"],
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
      },
      backgroundImage: {
        "hero-pattern": "url('/noise.png')", // Optional texture
      },
    },
  },
  plugins: [],
};

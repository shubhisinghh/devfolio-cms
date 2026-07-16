/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: "#10131C",
          surface: "#171B27",
          surface2: "#1E2333",
          border: "#2A3040",
        },
        paper: {
          bg: "#F7F7F5",
          surface: "#FFFFFF",
          surface2: "#F0F0EE",
          border: "#DEDEDA",
        },
        amber: {
          DEFAULT: "#E8B54C",
          soft: "#F3D08A",
        },
        cyan: {
          DEFAULT: "#5FD3C4",
          soft: "#9BE5DB",
        },
        violet: {
          DEFAULT: "#B29CF0",
          soft: "#D3C6F7",
        },
        rose: {
          DEFAULT: "#E8748A",
          soft: "#F0A3B2",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(95, 211, 196, 0.15), 0 8px 30px rgba(0,0,0,0.35)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: 1 },
          "50%, 100%": { opacity: 0 },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        fadeUp: "fadeUp 0.6s ease forwards",
      },
    },
  },
  plugins: [],
}

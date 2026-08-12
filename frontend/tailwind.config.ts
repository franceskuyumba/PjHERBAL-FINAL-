import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effaf3",
          100: "#d8f2e0",
          200: "#b4e4c6",
          300: "#83cfa3",
          400: "#4fb27b",
          500: "#2d965e",
          600: "#1f7a4b",
          700: "#1a623e",
          800: "#174e33",
          900: "#13402b",
          950: "#0a2418",
        },
        gold: {
          50: "#fbf7eb",
          100: "#f5edcc",
          200: "#ecd99c",
          300: "#e2c064",
          400: "#d9a83d",
          500: "#c98f2a",
          600: "#ad6e22",
          700: "#8b501f",
          800: "#744120",
          900: "#64371f",
          950: "#3a1c0f",
        },
        cream: "#faf7f0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(10,36,24,0.06), 0 8px 24px rgba(10,36,24,0.06)",
        lift: "0 4px 12px rgba(10,36,24,0.08), 0 16px 40px rgba(10,36,24,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.06)", opacity: "0.92" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        marquee: "marquee 30s linear infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

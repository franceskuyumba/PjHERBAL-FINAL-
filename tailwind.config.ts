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
          50: "#f0f9f1",
          100: "#dbf0dd",
          200: "#b9e2bf",
          300: "#8ccd98",
          400: "#5ab06c",
          500: "#2f8f4e",
          600: "#1f733d",
          700: "#185c33",
          800: "#14492a",
          900: "#113c24",
          950: "#082115",
        },
        gold: {
          50: "#fdf9eb",
          100: "#f9efc8",
          200: "#f3dd8d",
          300: "#ecc553",
          400: "#e7b13a",
          500: "#d49526",
          600: "#b7741e",
          700: "#92551c",
          800: "#79441d",
          900: "#67391d",
          950: "#3c1d0c",
        },
        cream: "#faf8f3",
        ink: "#0f1f16",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 2px 20px -6px rgba(17, 60, 36, 0.12)",
        lift: "0 18px 44px -14px rgba(17, 60, 36, 0.28)",
        glow: "0 0 0 3px rgba(47, 143, 78, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

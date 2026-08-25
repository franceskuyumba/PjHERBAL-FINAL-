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
          50: "#EFF8F0",
          100: "#D5EDDA",
          200: "#B1DDBA",
          300: "#82C691",
          400: "#4FA864",
          500: "#2D6A4F",
          600: "#1B4332",
          700: "#163628",
          800: "#112B1F",
          900: "#0D2118",
          950: "#071510",
        },
        sage: {
          50: "#F0F7F2",
          100: "#D8EDD9",
          200: "#B5DEC0",
          300: "#95D5B2",
          400: "#74C69D",
          500: "#52B788",
          600: "#40916C",
          700: "#2D6A4F",
        },
        gold: {
          50: "#FBF6EA",
          100: "#F5E9C8",
          200: "#EBDA96",
          300: "#DFC56A",
          400: "#D4AE3D",
          500: "#C9A96E",
          600: "#B08A42",
          700: "#8C6A32",
          800: "#6B5028",
          900: "#4D3A1E",
          950: "#2E210F",
        },
        cream: "#FAFAF5",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F0F4F0",
          warm: "#FAFAF5",
        },
        ink: {
          DEFAULT: "#1A1A2E",
          muted: "#4A5568",
          subtle: "#718096",
        },
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        card: "0 2px 16px -4px rgba(13, 33, 24, 0.08), 0 1px 4px -1px rgba(13, 33, 24, 0.04)",
        lift: "0 20px 48px -12px rgba(13, 33, 24, 0.22), 0 8px 20px -8px rgba(13, 33, 24, 0.12)",
        glow: "0 0 0 3px rgba(45, 106, 79, 0.15)",
        elevated: "0 4px 24px -4px rgba(13, 33, 24, 0.12), 0 2px 8px -2px rgba(13, 33, 24, 0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      transitionDuration: {
        fast: "150ms",
        base: "300ms",
        slow: "500ms",
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
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-subtle": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-up": "slide-up 0.5s ease-out both",
        "zoom-subtle": "zoom-subtle 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;

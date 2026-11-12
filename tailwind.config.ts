import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0e1a",
          900: "#101527",
          800: "#171e33",
          700: "#202a45",
          600: "#2b3860",
        },
        accent: {
          DEFAULT: "#6366f1",
          soft: "#818cf8",
          glow: "#a5b4fc",
        },
        mint: "#34d399",
        amberx: "#fbbf24",
        rosex: "#fb7185",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.45", transform: "scale(0.82)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

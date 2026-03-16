import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        crypto: {
          bg: "#070b12",
          card: "#0b0f17",
          cardBorder: "#141c2b",
          deep: "#0a0e17",
          surface: "#0e1628",
          gold: "#e2e8f0",
          muted: "#7a8ba3",
          dim: "#4b5c73",
          ghost: "#3d4d65",
          accent: "#3b82f6",
          success: "#34d399",
          successDark: "#0d3320",
          successBorder: "#065f46",
          danger: "#f87171",
          dangerDark: "#3b1c1c",
          dangerBorder: "#7f1d1d",
          warn: "#fbbf24",
          warnDark: "#312e2a",
          warnBorder: "#78350f",
          info: "#38bdf8",
          infoDark: "#0c2d48",
          infoBorder: "#0e4a6e",
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

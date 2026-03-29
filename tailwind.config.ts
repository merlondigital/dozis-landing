import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DOZIS brand colors from variables.css
        dozis: {
          black: "#000000",
          navy: { DEFAULT: "#0d1f3c", deep: "#0a1628" },
          amber: { DEFAULT: "#d4a017", light: "#e8b84a", dark: "#b8860b" },
          blue: { DEFAULT: "#1e40af", light: "#3b82f6" },
        },
      },
      fontFamily: {
        heading: ["var(--font-anton)", "sans-serif"],
        body: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

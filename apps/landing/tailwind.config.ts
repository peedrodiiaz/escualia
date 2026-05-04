import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1D4ED8",
          "blue-dark": "#1e3a8a",
          orange: "#F97316",
          "orange-dark": "#ea580c",
        },
      },
    },
  },
  plugins: [],
};

export default config;

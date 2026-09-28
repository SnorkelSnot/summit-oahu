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
        // Summit O'ahu Brand Palette
        palm: {
          50: "#f4f9f0",
          100: "#e5f0dc",
          200: "#cce1bc",
          300: "#a6cb8e",
          400: "#7db362",
          500: "#5a9a3e",
          600: "#437a2d",
          700: "#365f26",
          800: "#2d4d22",
          900: "#1a3a1a",
          950: "#0d1f0d",
        },
        ocean: {
          50: "#f0f9fa",
          100: "#d9f0f3",
          200: "#b8e2e8",
          300: "#87ccd6",
          400: "#4faebe",
          500: "#3494a5",
          600: "#2d788a",
          700: "#2a6272",
          800: "#28505e",
          900: "#254350",
          950: "#142b36",
        },
        sand: {
          50: "#fdfbf7",
          100: "#f9f3e8",
          200: "#f2e4cc",
          300: "#e8d0a8",
          400: "#ddb87e",
          500: "#d4a45e",
          600: "#c48d48",
          700: "#a3713c",
          800: "#835b36",
          900: "#6b4b2e",
          950: "#392617",
        },
        lava: {
          50: "#f6f5f5",
          100: "#e7e5e4",
          200: "#d2cecc",
          300: "#b2aca8",
          400: "#8a827d",
          500: "#6f6762",
          600: "#5e5753",
          700: "#4e4946",
          800: "#433f3d",
          900: "#3a3735",
          950: "#1e1c1b",
        },
        gold: {
          50: "#fdfaed",
          100: "#f9f0cc",
          200: "#f3df95",
          300: "#edc95e",
          400: "#e8b638",
          500: "#df9a20",
          600: "#c57818",
          700: "#a45717",
          800: "#864519",
          900: "#6e3918",
          950: "#3f1d09",
        },
      },
      fontFamily: {
        display: ["Michroma", '"Trebuchet MS"', "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-tropical":
          "linear-gradient(135deg, #1a3a1a 0%, #2d5016 50%, #142b36 100%)",
        "gradient-sunset":
          "linear-gradient(135deg, #d4734a 0%, #e8a94a 50%, #c8a45c 100%)",
        "gradient-ocean":
          "linear-gradient(135deg, #142b36 0%, #2d788a 50%, #3494a5 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

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
        triva: {
          crimson: {
            DEFAULT: "#851919",
            50: "#fdf3f3",
            100: "#fbe4e4",
            200: "#f7cece",
            300: "#f0abab",
            400: "#e47a7a",
            500: "#d34c4c",
            600: "#b52c2c",
            700: "#982020",
            800: "#851919",
            900: "#681818",
            950: "#3d0808",
          },
          charcoal: {
            DEFAULT: "#1e1e24",
            50: "#f6f6f7",
            100: "#e2e2e5",
            200: "#c5c5cb",
            300: "#a3a3ad",
            400: "#7c7c8a",
            500: "#5d5d6c",
            600: "#444450",
            700: "#32323b",
            800: "#1e1e24",
            900: "#141418",
          },
          amber: {
            DEFAULT: "#c59b27",
            light: "#dfb84b",
            dark: "#9c7613",
          },
          surface: "#f8f9fa",
        },
      },
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};

export default config;

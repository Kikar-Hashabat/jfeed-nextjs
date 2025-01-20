import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        "secondary-dark": "var(--secondary-color-dark)",
        divider: "var(--divider-color)",
      },
      fontFamily: {
        newsreader: "var(--font-newsreader)",
      },
      screens: {
        layout: "1200px",
        mobile: "768px",
      },
    },
  },
  plugins: [],
} satisfies Config;

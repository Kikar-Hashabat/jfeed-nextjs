// tailwind.config.ts
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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        primarytext: "var(--primary-text)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        roofbg: "var(--roof-bg)",
      },
      fontFamily: {
        newsreader: ["var(--font-newsreader)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "article-title": [
          "2rem",
          {
            lineHeight: "2.5rem",
            fontWeight: "700",
          },
        ],
        "article-body": [
          "1.125rem",
          {
            lineHeight: "1.75rem",
          },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

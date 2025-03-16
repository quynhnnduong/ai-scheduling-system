import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(350, 80%, 85%)", // Light pink
          foreground: "hsl(350, 80%, 25%)",
        },
        secondary: {
          DEFAULT: "hsl(350, 30%, 95%)", // Very light pink
          foreground: "hsl(350, 60%, 30%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 40%, 60%)", // Muted red
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(350, 20%, 96%)", // Very light pink-gray
          foreground: "hsl(350, 10%, 40%)",
        },
        accent: {
          DEFAULT: "hsl(350, 30%, 92%)", // Light pink accent
          foreground: "hsl(350, 60%, 30%)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        confirmed: {
          DEFAULT: "hsl(350, 60%, 85%)", // Pink confirmed
          foreground: "hsl(350, 80%, 30%)",
        },
        pending: {
          DEFAULT: "hsl(0, 0%, 90%)", // Light gray pending
          foreground: "hsl(0, 0%, 30%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        "2xl": "1.75rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config


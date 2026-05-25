/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Bebas Neue"', "Impact", "sans-serif"],
        quote: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Manrope"', "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          primary: "#050505",
          secondary: "#0A0A0A",
          tertiary: "#141414",
          paper: "#121110",
        },
        ink: {
          primary: "#F5F5F0",
          secondary: "#A3A3A3",
          muted: "#737373",
        },
        gold: {
          DEFAULT: "#C5A059",
          hover: "#D4AF37",
          dim: "#8a6f3c",
        },
        crimson: {
          DEFAULT: "#5C0B0B",
          glow: "rgba(92, 11, 11, 0.35)",
        },
        // shadcn required
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(24px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "marquee-left": { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "pulse-glow": { "0%, 100%": { opacity: "0.35" }, "50%": { opacity: "0.7" } },
        "shimmer-gold": { "0%": { backgroundPosition: "0% 50%" }, "100%": { backgroundPosition: "200% 50%" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 1.2s ease-out both",
        "marquee-left": "marquee-left 40s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "shimmer-gold": "shimmer-gold 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

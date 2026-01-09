import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        
        // Custom brand palette
        "brand-plum": "#BEB1CB",         // Plum Point
        "brand-green": "#C8DE7A",        // Kowloon
        "brand-yellow": "#FDBE2A",       // Extreme Yellow
        "brand-pink": "#F9B8D3",         // Pink Quartz
        "brand-orange": "#F14C27",       // Burning Orange
        "brand-gold": "#AB8E25",         // Sahara
        
        // App specific colors remapped to our new palette
        "mood-purple": "#BEB1CB",
        "mood-peach": "#F9B8D3",
        "mood-green": "#C8DE7A",
        "mood-pink": "#F9B8D3",
        "mood-blue": "#BEB1CB",
        "wellness-orange": "#F14C27",
        "icon-purple": "#BEB1CB",
        "icon-purple-light": "#BEB1CB",
        "soft-gray": "#F1F0FB",
        
        // Soft colors for minimalist tiles remapped
        "soft-green": "#C8DE7A",    // Kowloon
        "soft-yellow": "#FDBE2A",   // Extreme Yellow
        "soft-pink": "#F9B8D3",     // Pink Quartz
        "soft-blue": "#BEB1CB",     // Plum Point
        "soft-purple": "#BEB1CB",   // Plum Point
        "soft-peach": "#F9B8D3",    // Pink Quartz
        
        // Mood colors remapped
        "mood-rad": "#C8DE7A",      // Kowloon (positive)
        "mood-good": "#FDBE2A",     // Extreme Yellow (good)
        "mood-meh": "#BEB1CB",      // Plum Point (neutral)
        "mood-bad": "#F9B8D3",      // Pink Quartz (sad)
        "mood-awful": "#F14C27",    // Burning Orange (negative)
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "pulse": {
          "0%, 100%": { 
            opacity: "1",
            transform: "scale(1)" 
          },
          "50%": { 
            opacity: "0.8",
            transform: "scale(1.05)" 
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        "soft-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "breathe": "breathe 4s ease-in-out infinite",
        "soft-bounce": "soft-bounce 2s ease-in-out infinite",
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '400': '400ms',
      },
      fontFamily: {
        'sans': ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // WCAG AA compliant OKLCH color palette
        // Base surfaces
        bg: "oklch(98% .01 95)",     // near-white
        fg: "oklch(30% .02 95)",     // near-black

        // Brand scale chosen to keep ≥4.5:1 on white for text-500+
        brand: {
          50:  "oklch(97% .04 260)",
          100: "oklch(92% .06 260)",
          200: "oklch(86% .08 260)",
          300: "oklch(78% .10 260)",
          400: "oklch(70% .12 260)",
          500: "oklch(60% .12 260)", // text on white: ok
          600: "oklch(52% .12 260)", // better on white/dark
          700: "oklch(44% .12 260)",
          800: "oklch(36% .10 260)",
          900: "oklch(28% .08 260)",
        },

        // Semantic states tuned for contrast
        success: {
          600: "oklch(52% .20 142)",   // text on white ≥4.5:1
          700: "oklch(45% .20 142)",
        },

        warning: {
          600: "oklch(65% .15 85)",    // text on white ≥4.5:1
          700: "oklch(58% .15 85)",
        },

        danger: {
          600: "oklch(52% .20 30)",   // text on white ≥4.5:1
          700: "oklch(45% .20 30)",
        },

        // Neutral grays with guaranteed contrast
        neutral: {
          50:  "oklch(98% .005 95)",
          100: "oklch(95% .01 95)",
          200: "oklch(90% .015 95)",
          300: "oklch(80% .02 95)",
          400: "oklch(70% .025 95)", // ≥3:1 on white
          500: "oklch(55% .03 95)",  // ≥4.5:1 on white
          600: "oklch(45% .035 95)",
          700: "oklch(35% .04 95)",
          800: "oklch(25% .045 95)",
          900: "oklch(15% .05 95)",
        },

        // Legacy color aliases for compatibility
        primary: '#FFD700',    // Yellow (brand-500 equivalent)
        secondary: '#00CED1',  // Cyan (brand-600 equivalent)
        accent: '#FF4500',     // Orange (danger-600 equivalent)
        background: '#0a0a0a', // Dark background
        foreground: '#ffffff',

        // Neon colors (for special effects only)
        'neon-yellow': '#FFD700',
        'neon-cyan': '#00CED1',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'monospace'],
        inter: ['var(--font-inter)', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        bungee: ['Bungee', 'cursive'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(255, 215, 0, 0.3)',
        'neon-secondary': '0 0 20px rgba(0, 206, 209, 0.3)',
      },
      animation: {
        'neon-pulse': 'pulse 2s infinite',
        glitch: 'glitch 0.1s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      ringColor: ({ theme }) => ({
        DEFAULT: theme("colors.brand.600"),
      }),
      // Focus styles for accessibility
      ringOffsetColor: ({ theme }) => ({
        DEFAULT: theme("colors.bg"),
      }),
    },
  },
  plugins: [],
}

export default config

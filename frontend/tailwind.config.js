/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand: deep navy healthcare blue
        brand: {
          50:  '#e8f4ff',
          100: '#cce4ff',
          200: '#99c9ff',
          300: '#66adff',
          400: '#3392ff',
          500: '#0070f3',
          600: '#0059c2',
          700: '#004391',
          800: '#002c61',
          900: '#001630',
          950: '#000b18',
        },
        // Cyber-teal accent for AI features
        cyan: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Navy dark backgrounds
        navy: {
          900: '#0a0f1e',
          950: '#060b17',
          1000: '#03060f',
        },
        // Charcoal surface layers
        slate: {
          825: '#1c2537',
          850: '#151e2e',
          900: '#0f172a',
          925: '#0d1424',
          950: '#0b0f19',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #060b17 0%, #0a0f1e 50%, #060b17 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        'gradient-brand': 'linear-gradient(135deg, #0059c2 0%, #0070f3 50%, #3392ff 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        'grid-pattern': 'linear-gradient(rgba(0,112,243,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,112,243,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(0, 112, 243, 0.15)',
        'brand-md': '0 4px 20px rgba(0, 112, 243, 0.25)',
        'brand-lg': '0 8px 40px rgba(0, 112, 243, 0.30)',
        'cyan-sm':  '0 2px 8px rgba(6, 182, 212, 0.15)',
        'cyan-md':  '0 4px 20px rgba(6, 182, 212, 0.25)',
        'card':     '0 1px 3px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.25)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)',
        'inset-brand': 'inset 0 1px 0 rgba(0,112,243,0.3)',
        'glow-green': '0 0 12px rgba(34,197,94,0.4)',
        'glow-red':   '0 0 12px rgba(239,68,68,0.4)',
        'glow-amber': '0 0 12px rgba(245,158,11,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

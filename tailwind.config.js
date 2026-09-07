/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        background: '#EEF2F6',
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D766E',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
          DEFAULT: '#0D766E',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      boxShadow: {
        'soft-sm': '0 2px 8px 0 rgba(15, 23, 42, 0.04), 0 1px 2px 0 rgba(15, 23, 42, 0.02)',
        'soft': '0 8px 24px -4px rgba(15, 23, 42, 0.06), 0 2px 8px -2px rgba(15, 23, 42, 0.03)',
        'soft-lg': '0 16px 36px -6px rgba(15, 23, 42, 0.08), 0 6px 16px -3px rgba(15, 23, 42, 0.04)',
        'soft-xl': '0 24px 48px -8px rgba(15, 23, 42, 0.10), 0 10px 24px -4px rgba(15, 23, 42, 0.05)',
        'inset-soft': 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.04)',
        'brand-glow': '0 8px 20px -2px rgba(13, 118, 110, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}

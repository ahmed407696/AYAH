/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#05070D',
          900: '#0A0E17',
          850: '#0D1220',
          800: '#111726',
          700: '#1A2138',
          600: '#2A3352'
        },
        paper: {
          DEFAULT: '#F5F6FA',
          50: '#FAFBFE',
          200: '#E8EAF2',
          300: '#D8DCE8'
        },
        brand: {
          50: '#EEEDFE',
          100: '#E0DEFC',
          200: '#C6C2FA',
          300: '#A7A2F8',
          400: '#8B84F7',
          500: '#6D5DF6',
          600: '#5B48E4',
          700: '#4C39C7',
          800: '#3E2FA0',
          900: '#332A7D'
        },
        aqua: {
          400: '#34E0F5',
          500: '#22D3EE',
          600: '#0FB5D4'
        }
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk Variable"', '"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 8px 30px -6px rgba(109, 93, 246, 0.45)',
        'glow-sm': '0 4px 18px -4px rgba(109, 93, 246, 0.5)',
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px -12px rgba(16,24,40,.12)',
        'card-dark': '0 1px 0 rgba(255,255,255,.04) inset, 0 12px 32px -16px rgba(0,0,0,.6)'
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        float: 'float 5s ease-in-out infinite'
      }
    }
  },
  plugins: []
}

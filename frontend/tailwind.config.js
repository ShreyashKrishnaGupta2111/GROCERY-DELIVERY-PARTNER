/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // support class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fff6a8',
          DEFAULT: '#f7d700',
          strong: '#f2bf00',
        },
        ink: {
          DEFAULT: '#17210f',
          light: '#2e3a24',
        },
        muted: '#617052',
        cream: '#fffbea',
        lime: '#e9ff58',
        green: {
          DEFAULT: '#2fb344',
          dark: '#157226',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 24px 80px rgba(23, 33, 15, 0.16)',
        subtle: '0 14px 44px rgba(23, 33, 15, 0.08)',
      },
      animation: {
        'marquee': 'marquee 18s linear infinite',
        'float-delay-0': 'float 3.4s ease-in-out infinite',
        'float-delay-1': 'float 3.4s ease-in-out infinite 0.5s',
        'float-delay-2': 'float 3.4s ease-in-out infinite 0.9s',
        'float-delay-3': 'float 3.4s ease-in-out infinite 1.2s',
        'pulse-slow': 'pulse-slow 1.5s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(8deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        }
      }
    },
  },
  plugins: [],
}

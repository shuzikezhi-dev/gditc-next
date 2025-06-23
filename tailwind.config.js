/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3C65F7',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FF',
          300: '#A5B4FF',
          400: '#818CF8',
          500: '#3C65F7',
          600: '#3B4BF0',
          700: '#3538CD',
          800: '#2D2A94',
          900: '#2D2A94',
        },
        secondary: {
          DEFAULT: '#0BB489',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#0BB489',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        gray: {
          1: '#F8F9FA',
          2: '#F1F5F9',
          3: '#E2E8F0',
          4: '#CBD5E1',
          5: '#94A3B8',
          6: '#64748B',
          7: '#475569',
          8: '#334155',
          9: '#1E293B',
        },
        'body-color': '#637381',
        'dark': '#1D2144',
        'dark-2': '#252A42',
        'dark-6': '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      boxShadow: {
        'testimonial': '0 10px 40px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // @tailwindcss/line-clamp is now included by default in Tailwind CSS v3.3+
  ],
} 
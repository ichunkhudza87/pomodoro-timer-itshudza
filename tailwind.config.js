/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          '100': 'var(--primary-100)',
          '200': 'var(--primary-200)',
          '300': 'var(--primary-300)',
          '400': 'var(--primary-400)',
          '500': 'var(--primary-500)',
          '600': 'var(--primary-600)',
          '700': 'var(--primary-700)',
          '800': 'var(--primary-800)',
          '900': 'var(--primary-900)',
          DEFAULT: 'var(--color-primary)',
        },
        secondary: {
          '100': 'var(--secondary-100)',
          '200': 'var(--secondary-200)',
          '300': 'var(--secondary-300)',
          '400': 'var(--secondary-400)',
          '500': 'var(--secondary-500)',
          '600': 'var(--secondary-600)',
          '700': 'var(--secondary-700)',
          '800': 'var(--secondary-800)',
          '900': 'var(--secondary-900)',
          DEFAULT: 'var(--color-secondary)',
        },
        accent: {
          '100': 'var(--accent-100)',
          '200': 'var(--accent-200)',
          '300': 'var(--accent-300)',
          '400': 'var(--accent-400)',
          '500': 'var(--accent-500)',
          '600': 'var(--accent-600)',
          '700': 'var(--accent-700)',
          '800': 'var(--accent-800)',
          '900': 'var(--accent-900)',
          DEFAULT: 'var(--color-accent)',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'width': 'width',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};
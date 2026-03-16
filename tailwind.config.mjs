import starlightPlugin from '@astrojs/starlight-tailwind';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#3B0764',
        },
        cyan: {
          DEFAULT: '#38BDF8',
          400: '#38BDF8',
          500: '#0EA5E9',
        },
        surface: '#14141F',
        background: '#0A0A0F',
      },
      fontFamily: {
        heading: ['Alpha Lyrae', 'system-ui', 'sans-serif'],
        body: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [starlightPlugin(), typographyPlugin()],
};

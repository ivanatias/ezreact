import starlightPlugin from '@astrojs/starlight-tailwind'

// Generated color palettes
const accent = {
  200: '#b6cbe2',
  300: '#8ab1d4',
  400: '#5e97c6',
  500: '#0077a1',
  600: '#00508b',
  700: '#004b7f',
  800: '#003f6e',
  900: '#18344f',
  950: '#142536'
}
const gray = {
  100: '#f5f6f8',
  200: '#eceef2',
  300: '#c0c2c7',
  400: '#888b96',
  500: '#545861',
  700: '#353841',
  800: '#24272f',
  900: '#17181c'
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: { accent, gray }
    }
  },
  plugins: [starlightPlugin()]
}

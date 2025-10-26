/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      screens: {
        'mobile': '375px',
        'desktop': '1025px',
      },
    },
  },
  plugins: [],
}

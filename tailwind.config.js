/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fbf5ee',
        burgundy: '#6b1a2a',
        gold: '#c9993a',
        'deep-burg': '#4a0f1c',
        'warm-beige': '#e2c9a8',
        'dusty-pink': '#c4788a',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)'],
        dmSans: ['var(--font-dm-sans)'],
      },
    },
  },
  plugins: [],
}

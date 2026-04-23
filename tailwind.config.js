/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fbf5ee",
        burgundy: {
          DEFAULT: "#6b1a2a",
        },
        gold: {
          DEFAULT: "#c9993a",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

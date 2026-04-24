/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fbf5ee",
        burgundy: {
          DEFAULT: "#6b1a2a",
          10: "rgba(107,26,42,0.1)",
          30: "rgba(107,26,42,0.3)",
          50: "rgba(107,26,42,0.5)",
          60: "rgba(107,26,42,0.6)",
          70: "rgba(107,26,42,0.7)",
        },
        gold: {
          DEFAULT: "#c9993a",
          30: "rgba(201,153,58,0.3)",
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

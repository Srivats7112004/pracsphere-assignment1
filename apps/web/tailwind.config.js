/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Monorepo: scan shared packages too
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/utils/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: "var(--radius)",
      },
    },
  },
  plugins: [],
};

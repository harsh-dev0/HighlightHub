const config = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
}

export default config

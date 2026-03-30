/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        deepBlack: "#0A0A0A",
        softWhite: "#F5F5F5",
        terracotta: "#C47A5C",
      },
      fontFamily: {
        outfit: ["Outfit_400Regular", "Outfit_700Bold"],
        dmSans: ["DMSans_400Regular", "DMSans_500Medium", "DMSans_700Bold"],
      },
    },
  },
  plugins: [],
};

export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aiPrimary: {
          DEFAULT: '#e0f2ff',           // Light background (light mode)
          dark: '#0f172a',              // Dark background (dark mode, slate-like blue)
        },
        aiAccent: {
          DEFAULT: '#3b82f6',           // Blue accent
          dark: '#2563eb',              // Darker blue on hover
        },
        aiText: {
          DEFAULT: '#0f172a',           // Blue-black text (light mode)
          dark: '#e0f2ff',              // Light blue text (dark mode)
          
        },
      },
    },
  },
  plugins: [],
}

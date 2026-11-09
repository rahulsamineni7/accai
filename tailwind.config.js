/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch Design System tokens
        "primary": "#006948",
        "primary-container": "#00855d",
        "on-primary": "#ffffff",
        "secondary": "#006c49",
        "secondary-container": "#6cf8bb",
        "on-secondary-container": "#00714d",
        "secondary-fixed": "#6ffbbe",
        "secondary-fixed-dim": "#4edea3",
        "primary-fixed": "#85f8c4",
        "background": "#faf8ff",
        "on-background": "#131b2e",
        "surface": "#faf8ff",
        "on-surface": "#131b2e",
        "on-surface-variant": "#3d4a42",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "surface-variant": "#dae2fd",
        "outline": "#6d7a72",
        "outline-variant": "#bccac0",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",

        digits: {
          bg: '#faf8ff',
          surface: '#ffffff',
          card: '#ffffff',
          hover: '#f2f3ff',
          border: '#e2e7ff',
          borderActive: '#006948',
          neonGreen: '#006948',
          accentGreen: '#00855d',
          subtleGreen: '#6cf8bb',
          primary: '#006948',
          orange: '#fba772',
          amber: '#fde047',
          alertDark: '#c2410c',
          aiBlue: '#38bdf8',
          aiPurple: '#a855f7',
          cyan: '#06b6d4',
          cloudWhite: '#131b2e',
          muted: '#6d7a72',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 20px 40px -15px rgba(5, 25, 15, 0.28), inset 0 1px 1px 0 rgba(255, 255, 255, 0.75), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.2)',
        'glass-sm': '0 8px 24px -6px rgba(5, 25, 15, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.65)',
        'glass-pill': '0 4px 16px -2px rgba(5, 25, 15, 0.15), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
      }
    },
  },
  plugins: [],
}

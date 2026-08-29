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
        aerodark: {
          950: '#070A10',
          900: '#0B0F17',
          850: '#0F1522',
          800: '#141D2E',
          750: '#1A253A',
          700: '#22304A',
          600: '#334766',
        },
        aeroblue: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        aerocyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        naqi: {
          good: '#10B981',       // 0-50 Green
          satisfactory: '#84CC16',// 51-100 Light Green
          moderate: '#F59E0B',   // 101-200 Yellow/Orange
          poor: '#F97316',       // 201-300 Orange
          verypoor: '#EF4444',   // 301-400 Red
          severe: '#7F1D1D',     // 401-500 Dark Maroon/Purple
        },
        anomaly: {
          normal: '#10B981',
          moderate: '#EAB308',
          high: '#F97316',
          severe: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}

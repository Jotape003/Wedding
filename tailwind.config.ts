import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          fundo: '#FAF7F2',
          blush: '#FBEBE7',
          sage: '#E5EAE4',
          lavender: '#EAE6FA',
          butter: '#FDF6E2',
          texto: '#4A443F',
        }
      },
      fontFamily: {
        serif: ['var(--font-titulo)', 'serif'],
        sans: ['var(--font-corpo)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;
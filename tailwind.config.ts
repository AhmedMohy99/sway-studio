import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        swayCyan: '#00F5FF', // The glow color from your logo
        swayDark: '#0A0A0A',
      },
    },
  },
  plugins: [],
}
export default config

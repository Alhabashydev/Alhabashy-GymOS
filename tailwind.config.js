/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#080808',
        surface: '#0F0F0F',
        elevated: '#161616',
        text: '#F0EDE8',
        muted: '#999795',
        tertiary: '#AAA9A7',
        accent: '#A8D8A8',
        danger: '#D99090',
      },
      fontFamily: {
        display: ['Syne', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: 'rgba(255, 255, 255, 0.04) 0px 0px 24px 0px',
        glowStrong: 'rgba(255, 255, 255, 0.08) 0px 0px 32px 0px',
      },
      borderRadius: {
        card: '16px',
        control: '12px',
      },
    },
  },
  plugins: [],
};

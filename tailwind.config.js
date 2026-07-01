/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm, editorial, light-forward palette
        base: '#FBF7F1', // warm off-white background
        orange: {
          DEFAULT: '#FF6B1A',
          hover: '#E8580C',
          light: '#FF8A3D',
        },
        ink: {
          black: '#0F0F10', // near-black heavy block
          charcoal: '#1C1C1F',
          raised: '#26262A',
        },
        text: {
          dark: '#141414', // text on light
          light: '#F5F2EC', // text on dark
        },
        muted: '#6E6E73', // secondary / borders
        divider: '#E7E2DA', // light divider
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Clash Display"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'orange-grad': 'linear-gradient(135deg, #FF8A3D 0%, #FF6B1A 100%)',
      },
      boxShadow: {
        card: '0 10px 40px -12px rgba(15,15,16,0.18)',
        glow: '0 0 40px -5px rgba(255,107,26,0.55)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

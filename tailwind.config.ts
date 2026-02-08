import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soft-pink': '#f8d7e6',
        'pastel-red': '#e6a1a1',
        'beige': '#f5f0eb',
        'cream': '#faf8f6',
        'romantic-red': '#d4757f',
        'warm-beige': '#e8dcc8',
      },
      fontFamily: {
        'serif-display': ['var(--font-playfair)', 'serif'],
        'serif-body': ['var(--font-lora)', 'serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.8s ease-in-out',
        'slideUp': 'slideUp 0.8s ease-out',
        'slideInLeft': 'slideInLeft 0.8s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'heartBeat': 'heartBeat 1.3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '10%': { transform: 'scale(1.15)' },
          '20%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15)' },
          '40%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-romantic': 'linear-gradient(135deg, #f8d7e6 0%, #faf8f6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f5f0eb 0%, #faf8f6 100%)',
        'gradient-rose': 'linear-gradient(135deg, #f8d7e6 0%, #e6a1a1 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

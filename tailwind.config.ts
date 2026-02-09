import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Purple Romantic Palette
        'purple-primary': '#6B3FA0',      // Deep Purple
        'purple-secondary': '#C8A8D8',    // Soft Lavender
        'purple-accent': '#9D4E6C',       // Rose Purple
        'purple-warm': '#7B4B7B',         // Warm Plum
        'purple-light': '#D4C5E0',        // Light Lavender
        'purple-pale': '#F0E6F7',         // Very Light Purple
        'purple-dark': '#4A2A6B',         // Dark Purple
        
        // Neutrals
        'neutral-off-white': '#F9F7FC',
        'neutral-light': '#E8E3F0',
        'neutral-dark': '#2A2A2A',
        
        // Legacy support (remapped to purple)
        'soft-pink': '#F0E6F7',
        'pastel-red': '#C8A8D8',
        'beige': '#F9F7FC',
        'cream': '#F0E6F7',
        'romantic-red': '#9D4E6C',
        'warm-beige': '#E8E3F0',
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
        'gradient-romantic': 'linear-gradient(135deg, #F0E6F7 0%, #F9F7FC 100%)',
        'gradient-warm': 'linear-gradient(135deg, #E8E3F0 0%, #F9F7FC 100%)',
        'gradient-rose': 'linear-gradient(135deg, #9D4E6C 0%, #C8A8D8 100%)',
        'gradient-purple': 'linear-gradient(135deg, #6B3FA0 0%, #9D4E6C 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

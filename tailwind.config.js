/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 6s ease infinite',
        'gradient-y': 'gradient-y 8s ease infinite',
        'gradient-rotate': 'gradient-rotate 10s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'scale-up': 'scale-up 0.3s ease-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom',
          },
        },
        'gradient-rotate': {
          '0%': {
            'background-size': '200% 200%',
            'background-position': '0% 50%',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 50%',
          },
          '100%': {
            'background-size': '200% 200%',
            'background-position': '0% 50%',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 20px rgba(0, 255, 136, 0.5)',
          },
          '50%': {
            'box-shadow': '0 0 40px rgba(255, 0, 255, 0.8)',
          },
        },
        'float': {
          '0%, 100%': {
            'transform': 'translateY(0px)',
          },
          '50%': {
            'transform': 'translateY(-20px)',
          },
        },
        'sparkle': {
          '0%, 100%': {
            'opacity': '0',
            'transform': 'scale(0)',
          },
          '50%': {
            'opacity': '1',
            'transform': 'scale(1)',
          },
        },
        'scale-up': {
          '0%': {
            'transform': 'scale(0.9)',
            'opacity': '0',
          },
          '100%': {
            'transform': 'scale(1)',
            'opacity': '1',
          },
        },
      },
    },
  },
  plugins: [],
};

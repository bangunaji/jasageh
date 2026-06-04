/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        'chocobi-green': '#bce3b6',
        'shinchan-yellow': '#fdf59f',
        'shinchan-red': '#ff8b94',
        'pastel-blue': '#bae1ff',
        'pastel-pink': '#ffb3ba',
        'pastel-orange': '#ffd3b6',
        'pastel-purple': '#e8d7ff',
        'shiro-white': '#fafafa',
        'comic-black': '#1a1a1a',
        'comic-gray': '#ecebe4',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'comic': '5px 5px 0px #1a1a1a',
        'comic-sm': '3px 3px 0px #1a1a1a',
        'comic-xs': '2px 2px 0px #1a1a1a',
        'comic-lg': '8px 8px 0px #1a1a1a',
      },
      scale: {
        '115': '1.15',
      },
      animation: {
        'wiggle': 'wiggle 0.5s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

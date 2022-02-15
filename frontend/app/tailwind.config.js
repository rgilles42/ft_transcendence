const colors = require('tailwindcss/colors');

module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',

    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#070707',
      orange: colors.orange,
      white: colors.white,
      gray: colors.gray,
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.yellow,
      blue: colors.blue,
      green: colors.emerald,
    },
    flex: {
      1: '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      inherit: 'inherit',
      none: 'none',
      2: '2 2 0%',
      33: '1 1 33%',
    },
    extend: {
      colors: {
        orange: {
          light: '#F78F51',
          DEFAULT: '#ff6200',
          dark: '#ae4300',
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      scale: ['group-hover'],
      translate: ['group-hover'],
    },
  },
  plugins: [],
};

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'mb-background': '#070C2B',
        'card-color': '#1e3045'
      },
      screens: {
        'xsm': {'max': '800px'}
      },
      backgroundImage: {
        'hero-pattern': "url('/public/assets/images/1.jpg')",
      }
    },
  
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

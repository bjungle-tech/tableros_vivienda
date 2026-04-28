/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        comfandi: {
          azul: '#003DA5',
          azulOscuro: '#001F5C',
          cyan: '#00B5E2',
          verde: '#84BD00',
        },
      },
    },
  },
  plugins: [],
};

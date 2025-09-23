/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      animation: {
        // Para o hover 3D suave
        'spin-slow': 'spin 30s linear infinite',

        // Três linhas da borda LED percorrendo de forma independente
        move1: 'move1 4s linear infinite',
        move2: 'move2 5s linear infinite',
        move3: 'move3 6s linear infinite',
      },
      keyframes: {
        // Linha superior
        move1: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Linha inferior
        move2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        // Linha lateral (pode ser esquerda ou direita)
        move3: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}

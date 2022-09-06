const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily:{
      // 'card': ['Kolker Brush', 'Outfit', 'sans-serif', 'cursive']
      'card': ['Stalinist One', 'cursive'],
      'card2': ['Carter One', 'cursive'],
      'ens': ['Orbitron Bold', 'cursive'],
    },
    extend: {
      backgroundImage: {
        'banner': "url('/src/assets/banner/banner.png')",
        'button-corner': "url('/src/assets/banner/button_corner.png')",
       },
      container: {
        center: true,
        padding: '2rem',
      },
      "transitionDuration":{
        2500: '2500ms'
      },
      skew:{
        5: '5deg',
        3: '3deg',
        4: '4deg',
      },
      scale:{
        '120': '1.2',
        '140': '1.4',
        '130': '1.3',
      },
      inset:{
        '30':'7.5rem',
        '120': '60rem',
        '190': '80rem',
      },
      opacity:{
        '55': '0.55',
        '85': '0.85',
        '95': '0.95',
        '65': '0.65',
        '98': '0.98',
      },
      margin:{
        '15': '3.5rem',
        '17': '4rem',
        '35': '8rem',
      },
      width: {
        '9/10': '98%'
      },
      padding: {
        '13': '3.25rem',
        '14': '3.5rem',
        '15': '3.75rem',
        '16': '4rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '25': '6rem',
        '27': '6.5rem'
      },
      top: {
        '3/5': `60%`,
        '1/5': `20%`,
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '1': '1px',
      },
      colors: {
        clrBlue: "#1e9bff",
        teal: colors.teal,
        cyan: colors.cyan,
        midnight: '#121063',
        'black-rgba': 'rgba(0, 0, 0, 0.5)',
        clrShadow: 'hsl(317deg 77% 51%)',
        clrText: 'hsl(555 55% 54%)',
        clrNeon:'hsl(317 100% 54%)',
        clrBg: 'hsl(323 21% 16%)',
        clrBg2: 'hsl(800 55% 66%)',
        clrBgHover: 'hsl(777 60% 90%)',
        contractBg: '#FF6B00',
        minusButton: '#1affff',
      },
      animation: {
        "typing-blink": "typing 3s steps(50),blink 0.5s step-end infinite alternate",
        "blink": "blink 0.5s step-end infinite alternate",
        "hue": "hue 3s linear infinite"
      }
    },
   
    
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

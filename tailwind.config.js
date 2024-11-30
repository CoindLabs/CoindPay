const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette')

module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx,html}'],
  important: '#__next',
  darkMode: 'class',
  theme: {
    transitionTimingFunction: {
      'scale-cub': 'cubic-bezier(.25,.1,.3,1.6)',
    },
    screens: {
      ...defaultTheme.screens,
      'max-2xs': {
        max: '413px',
      },
      'max-xs': {
        max: '511px',
      },
      'max-sm': {
        max: '639px',
      },
      'max-md': {
        max: '767px',
      },
      'max-lg': {
        max: '1023px',
      },
      'max-xl': {
        max: '1279px',
      },
      'max-2xl': {
        max: '1535px',
      },
      'min-sm': {
        min: '640px',
      },
      'min-md': {
        min: '768px',
      },
      'min-lg': {
        min: '1024px',
      },
      'min-xl': {
        min: '1280px',
      },
      'min-2xl': {
        min: '1536px',
      },
    },
    extend: {
      screens: {
        '3xs': '375px',
        '2xs': '414px',
        xs: '512px',
        '3xl': '1866px',
      },
      fontFamily: {
        satisfy: ['Satisfy', 'sans-serif'],
        righteous: ['Righteous', 'serif'],
        courgette: ['Courgette', 'mono'],
        poppins: ['Poppins', 'mono'],
        chillax: ['Chillax', 'mono'],
        lato: ['Lato', 'sans-serif'],
        firasans: ['Fira Sans', 'serif'],
      },
      fontSize: {
        xxs: '0.5rem',
        '0.5xl': '1.125rem',
        '1.5xl': '1.375rem',
        '2.5xl': '1.75rem',
        '3.5xl': '2rem',
        '4.5xl': '2.5rem',
        '5.5xl': '3.375rem',
        '6.5xl': '4rem',
      },
      borderWidth: {
        3: '3px',
        9: '9px',
        10: '10px',
      },
      borderRadius: {
        '2.5xl': '1.125rem',
      },
      scale: {
        60: '.6',
        70: '.7',
        80: '.8',
        85: '.85',
        115: '1.15',
        120: '1.2',
        200: '2',
      },
      rotate: {
        270: '270deg',
        360: '360deg',
      },
      top: {
        50: '12.5rem',
      },
      right: {
        18: '4.5rem',
        54: '13.5rem',
      },
      zIndex: {
        1: 1,
        2: 2,
        5: 5,
        45: 45,
        60: 60,
        100: 100,
        150: 150,
        500: 500,
        999: 999,
        1000: 1000,
        1100: 1100,
        9999: 9999,
      },
      width: {
        8.5: '2.125rem',
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        25: '6.25rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        42: '10.5rem',
        50: '12.5rem',
        63: '15.75rem',
        68: '17rem',
        70: '17.5rem',
        76: '19rem',
        84: '21rem',
        88: '22rem',
        90: '22.5rem',
        100: '25rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        130: '32.5rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        144: '36rem',
        160: '40rem',
        '1/10': '10%',
        '7/10': '70%',
      },
      height: {
        8.5: '2.125rem',
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        20: '5rem',
        22: '5.5rem',
        25: '6.25rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        42: '10.5rem',
        50: '12.5rem',
        51: '12.75rem',
        68: '17rem',
        75: '18.75rem',
        76: '19rem',
        84: '21rem',
        88: '22rem',
        90: '22.5rem',
        100: '25rem',
        108: '27rem',
        112: '28rem',
        120: '30rem',
        124: '31rem',
        128: '32rem',
        130: '32.5rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        144: '36rem',
        160: '40rem',
      },
      size: {
        4.5: '1.125rem',
        13: '3.25rem',
        18: '4.5rem',
        30: '7.5rem',
        54: '13.5rem',
      },
      minHeight: {
        68: '17rem',
        84: '21rem',
        100: '25rem',
        104: '26rem',
        108: '27rem',
        112: '28rem',
        114: '28.5rem',
        116: '29rem',
        120: '30rem',
      },
      minWidth: {
        '1/2': '50%',
        100: '25rem',
      },
      maxWidth: {
        20: '5rem',
        28: '7rem',
        50: '12.5rem',
        60: '15rem',
        100: '25rem',
        '1/2': '50%',
        '3/5': '60%',
        '2/3': '66.67%',
        '4/5': '80%',
        '9/10': '90%',
        '2.5xl': '45rem',
        'screen-2k': '2000px',
      },
      maxHeight: {
        84: '21rem',
        86: '21.5rem',
        120: '30rem',
      },
      padding: {
        4.5: '1.125rem',
        18: '4.5rem',
      },
      margin: {
        15: '3.75rem',
        84: '21rem',
        '120-': '-30rem',
        '160-': '-10rem',
      },
      lineHeight: {
        0: 0,
        12: '3rem',
        x3: 3,
      },
      grayscale: {
        50: '50%',
      },
      opacity: {
        1: '0.01',
        2.5: '0.025',
        7.5: '0.075',
        15: '0.15',
      },
      blur: {
        xs: '2px',
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        20: '20',
        30: '30',
      },
      grayscale: {
        50: '50%',
      },
      backgroundImage: {
        'create-gradient-001': 'linear-gradient(90deg, #FC6D76 0%, #F320A2 100%)',
        'create-gradient-002': 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
        'create-gradient-003': 'linear-gradient(to right, #F82F9D 0%, #4510F3 100%)',
        'create-gradient-004': 'linear-gradient(135deg,#fc692a,#ffd800 26.04%,#72db5a 49.48%,#6dc4fe 75.52%,#cdb9fa)',
        'badge-gradient-001':
          'radial-gradient(111.89% 213.6% at 24.99% 43.36%, rgba(51, 71, 255, 0.4) 0%, rgba(223, 226, 255, 0.216) 74.98%, rgba(107, 122, 255, 0.4) 100%)',
        'badge-gradient-002': 'linear-gradient(138.43deg, #021918 -0.1%, rgba(40, 80, 225, 0.5) 162.62%)',
        'clip-gradient-001': 'linear-gradient(to right, #2a8af6 0%, #e92a67 100%)',
        'theconvo-gradient-001': "url('https://cdn.coindpay.xyz/status/gradient.webp')",
      },
      backgroundPosition: {
        'right-center': 'right center',
      },
      // 命名方式优先theme，其次属性如业务类型，比如组件ui/模板 - css属性 - 行为等，注意千万不要跟tailwind现有属性重名
      colors: {
        inherit: 'inherit',
        lighty: '#F9FFB8',
        pale: '#51EEC7',
        'theme-primary': '#00D395',
        'theme-success': '#09bf4b',
        'theme-accent': '#570DF8',
        'theme-warning': '#f37e00',
        'theme-error': '#FD2929',
        'theme-secondary': '#F320A2',
        'tpl-black-750': '#23262F',
        'tpl-yellow-250': '#FFF4CC',
        'tpl-yellow-450': '#FFE485',
        'tpl-grey-150': '#EFEFEF',
        'tpl-grey-250': '#B7B7B7',
        'skus-grey-160': '#E6E8EC',
        'skus-grey-650': '#777E91',
        'sidebar-deepblue': '#18182c',
        'card-deepblue': '#242438',
        'green-450': '#33EE94',
        'neutral-900': '#171717',
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
        'skew-scroll': {
          '0%': {
            transform: 'rotatex(20deg) rotateZ(-20deg) skewX(20deg) translateZ(0) translateY(0)',
          },
          '100%': {
            transform: 'rotatex(20deg) rotateZ(-20deg) skewX(20deg) translateZ(0) translateY(-100%)',
          },
        },
        rotateY: {
          '0%': {
            transform: 'rotateY(0deg)',
          },
          '80%': {
            transform: 'rotateY(360deg)',
          },
          '100%': {
            transform: 'rotateY(360deg)',
          },
        },
      },
      animation: {
        aurora: 'aurora 60s linear infinite',
        rotateY: 'rotateY 12s 0s linear infinite',
        'skew-scroll': 'skew-scroll 20s 0s ease-in-out infinite forwards',
      },
      transitionProperty: {
        animation: 'animation',
      },
      transitionDuration: {
        1500: '1500ms',
      },
      flex: {
        2: '2 1 0%',
        4: '4 1 0%',
        5: '5 1 0%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('daisyui'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.rotate-y-360': {
          transform: 'rotateY(360deg)',
        },
      })
    }),
    addVariablesForColors,
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#00D395',
          'primary-content': '#fff',
          success: '#72db5a',
          'success-content': '#fff',
          warning: '#f37e00',
          'warning-content': '#fff',
          error: '#FD2929',
          'error-content': '#fff',
          secondary: '#F000B8',
          'secondary-content': '#fff',
          info: '#3ABFF8',
          'info-content': '#fff',
          accent: '#570DF8',
          'accent-content': '#fff',
          neutral: '#000',
          'neutral-content': '#fff',
          'base-100': '#fff',
        },
        step: {
          primary: '#33EE94',
        },
      },
    ],
  },
  corePlugins: {
    // due to https://github.com/tailwindlabs/tailwindcss/issues/6602 - buttons disappear
    preflight: false,
  },
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'))
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]))

  addBase({
    ':root': newVars,
  })
}

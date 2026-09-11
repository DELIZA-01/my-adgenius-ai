/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#07070A',
        surface: '#0D0D12',
        card: '#12121A',
        hover: '#181824',
        borderCustom: '#272735',
        purplePrimary: '#7C3AED',
        purpleBright: '#A855F7',
        indigoCustom: '#6366F1',
        pinkCustom: '#EC4899',
        whiteCustom: '#F8FAFC',
        secondaryCustom: '#94A3B8',
        mutedCustom: '#64748B',
        successCustom: '#22C55E',
        warningCustom: '#F59E0B',
        errorCustom: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '16': '16px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
        'subtle-gradient': 'linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, rgba(7, 7, 10, 0) 100%)',
      }
    },
  },
  plugins: [],
}

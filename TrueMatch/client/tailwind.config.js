/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        /* ── Premium Burgundy-Rose-Gold Palette ── */
        brand: {
          50:  '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7896',
          500: '#C2185B',   // Rose-burgundy primary
          600: '#a31148',
          700: '#8B1A2B',   // Deep burgundy
          800: '#6e1530',
          900: '#5c1529',
          950: '#340812',
        },
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#D4AF37',   // Warm gold accent
          500: '#b8960e',
          600: '#9a7b0a',
          700: '#7c630d',
          800: '#674f12',
          900: '#574115',
        },
        cream: '#FFF8F0',       // Warm cream background
        surface: {
          DEFAULT: '#FFF8F0',
          50:  '#FFFDFB',
          100: '#FFF8F0',
          200: '#FFF0E0',
          300: '#FFE4C9',
        },
        accent: {
          DEFAULT: '#D4AF37',
          light:   '#F0D778',
          dark:    '#1a1a2e',
        },
        /* ── Dark mode surface colors ── */
        dark: {
          bg:      '#0f0f1a',
          surface: '#1a1a2e',
          card:    '#232340',
          border:  '#2d2d50',
          muted:   '#9ca3af',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card:         '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
        'card-hover': '0 0 0 1px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.10)',
        glass:        '0 8px 32px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.1)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)',
        glow:         '0 0 20px rgba(194, 24, 91, 0.15)',
        'glow-gold':  '0 0 20px rgba(212, 175, 55, 0.2)',
        nav:          '0 1px 0 0 rgba(0,0,0,0.04)',
        soft:         '0 1px 2px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-brand':     'linear-gradient(135deg, #8B1A2B, #C2185B)',
        'gradient-gold':      'linear-gradient(135deg, #D4AF37, #F0D778)',
        'gradient-hero':      'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 40%, #1a0a10 100%)',
        'gradient-card':      'linear-gradient(135deg, rgba(194,24,91,0.05), rgba(212,175,55,0.05))',
        'gradient-border':    'linear-gradient(135deg, #8B1A2B, #D4AF37, #C2185B)',
        'shimmer':            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        'shimmer-dark':       'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      animation: {
        'fade-in':       'fadeIn 0.4s ease-out',
        'slide-up':      'slideUp 0.5s ease-out',
        'pulse-soft':    'pulseSoft 3s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s ease-in-out infinite',
        'gradient-x':    'gradientX 3s ease infinite',
        'float':         'float 6s ease-in-out infinite',
        'glow-pulse':    'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(194, 24, 91, 0.15)' },
          '50%':      { boxShadow: '0 0 30px rgba(194, 24, 91, 0.3)' },
        },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#00D4FF', // Electric cyan - primary
        'primary-50': '#E6FBFF', // Very light cyan
        'primary-100': '#CCF7FF', // Light cyan
        'primary-200': '#99EFFF', // Medium light cyan
        'primary-300': '#66E7FF', // Medium cyan
        'primary-400': '#33DFFF', // Medium dark cyan
        'primary-500': '#00D4FF', // Electric cyan (primary)
        'primary-600': '#00AACC', // Dark cyan
        'primary-700': '#008099', // Darker cyan
        'primary-800': '#005566', // Very dark cyan
        'primary-900': '#002B33', // Darkest cyan

        // Secondary Colors
        'secondary': '#7C3AED', // Deep violet - secondary
        'secondary-50': '#F3F0FF', // Very light violet
        'secondary-100': '#E7E0FF', // Light violet
        'secondary-200': '#CFC1FF', // Medium light violet
        'secondary-300': '#B7A2FF', // Medium violet
        'secondary-400': '#9F83FF', // Medium dark violet
        'secondary-500': '#8764FF', // Bright violet
        'secondary-600': '#7C3AED', // Deep violet (secondary)
        'secondary-700': '#6B21A8', // Dark violet
        'secondary-800': '#581C87', // Very dark violet
        'secondary-900': '#3B0764', // Darkest violet

        // Accent Colors
        'accent': '#10B981', // Medical green - accent
        'accent-50': '#ECFDF5', // Very light green
        'accent-100': '#D1FAE5', // Light green
        'accent-200': '#A7F3D0', // Medium light green
        'accent-300': '#6EE7B7', // Medium green
        'accent-400': '#34D399', // Medium dark green
        'accent-500': '#10B981', // Medical green (accent)
        'accent-600': '#059669', // Dark green
        'accent-700': '#047857', // Darker green
        'accent-800': '#065F46', // Very dark green
        'accent-900': '#064E3B', // Darkest green

        // Background Colors
        'background': '#0F172A', // Deep slate - background
        'background-50': '#F8FAFC', // Very light slate
        'background-100': '#F1F5F9', // Light slate
        'background-200': '#E2E8F0', // Medium light slate
        'background-300': '#CBD5E1', // Medium slate
        'background-400': '#94A3B8', // Medium dark slate
        'background-500': '#64748B', // Dark slate
        'background-600': '#475569', // Darker slate
        'background-700': '#334155', // Very dark slate
        'background-800': '#1E293B', // Deep dark slate
        'background-900': '#0F172A', // Deep slate (background)

        // Surface Colors
        'surface': '#1E293B', // Elevated dark surface - surface
        'surface-50': '#F8FAFC', // Very light surface
        'surface-100': '#F1F5F9', // Light surface
        'surface-200': '#E2E8F0', // Medium light surface
        'surface-300': '#CBD5E1', // Medium surface
        'surface-400': '#94A3B8', // Medium dark surface
        'surface-500': '#64748B', // Dark surface
        'surface-600': '#475569', // Darker surface
        'surface-700': '#334155', // Very dark surface
        'surface-800': '#1E293B', // Elevated dark surface (surface)
        'surface-900': '#0F172A', // Darkest surface

        // Text Colors
        'text-primary': '#F8FAFC', // Near-white - text primary
        'text-secondary': '#94A3B8', // Muted slate - text secondary
        'text-tertiary': '#64748B', // Medium slate - text tertiary
        'text-quaternary': '#475569', // Dark slate - text quaternary

        // Status Colors
        'success': '#22C55E', // Vibrant green - success
        'success-50': '#F0FDF4', // Very light success green
        'success-100': '#DCFCE7', // Light success green
        'success-200': '#BBF7D0', // Medium light success green
        'success-300': '#86EFAC', // Medium success green
        'success-400': '#4ADE80', // Medium dark success green
        'success-500': '#22C55E', // Vibrant green (success)
        'success-600': '#16A34A', // Dark success green
        'success-700': '#15803D', // Darker success green
        'success-800': '#166534', // Very dark success green
        'success-900': '#14532D', // Darkest success green

        'warning': '#F59E0B', // Amber - warning
        'warning-50': '#FFFBEB', // Very light warning amber
        'warning-100': '#FEF3C7', // Light warning amber
        'warning-200': '#FDE68A', // Medium light warning amber
        'warning-300': '#FCD34D', // Medium warning amber
        'warning-400': '#FBBF24', // Medium dark warning amber
        'warning-500': '#F59E0B', // Amber (warning)
        'warning-600': '#D97706', // Dark warning amber
        'warning-700': '#B45309', // Darker warning amber
        'warning-800': '#92400E', // Very dark warning amber
        'warning-900': '#78350F', // Darkest warning amber

        'error': '#EF4444', // Critical red - error
        'error-50': '#FEF2F2', // Very light error red
        'error-100': '#FEE2E2', // Light error red
        'error-200': '#FECACA', // Medium light error red
        'error-300': '#FCA5A5', // Medium error red
        'error-400': '#F87171', // Medium dark error red
        'error-500': '#EF4444', // Critical red (error)
        'error-600': '#DC2626', // Dark error red
        'error-700': '#B91C1C', // Darker error red
        'error-800': '#991B1B', // Very dark error red
        'error-900': '#7F1D1D', // Darkest error red

        // Border Colors
        'border': 'rgba(148, 163, 184, 0.2)', // Strategic border color
        'border-light': 'rgba(148, 163, 184, 0.1)', // Light border
        'border-medium': 'rgba(148, 163, 184, 0.3)', // Medium border
        'border-strong': 'rgba(148, 163, 184, 0.5)', // Strong border
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'heading-normal': '400',
        'heading-semibold': '600',
        'heading-bold': '700',
        'body-normal': '400',
        'body-medium': '500',
        'caption-normal': '400',
        'data-normal': '400',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'clinical': '0 1px 3px rgba(0, 0, 0, 0.3)',
        'clinical-lg': '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      animation: {
        'pulse-clinical': 'pulse-clinical 2s infinite',
      },
      keyframes: {
        'pulse-clinical': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      zIndex: {
        'navigation': '1000',
        'dropdown': '1100',
        'modal': '1200',
      },
    },
  },
  plugins: [],
}
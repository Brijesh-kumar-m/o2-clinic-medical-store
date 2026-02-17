import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0EA5E9',
          secondary: '#06B6D4',
          accent: '#8B5CF6',
        },
        medical: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        surface: {
          bg: '#F9FAFB',
          light: '#F3F4F6',
          border: '#E5E7EB',
          disabled: '#D1D5DB',
        },
        txt: {
          placeholder: '#9CA3AF',
          secondary: '#6B7280',
          body: '#4B5563',
          heading: '#374151',
          dark: '#1F2937',
          primary: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 50%, #0369A1 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'gradient-premium': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      }
    },
  },
  plugins: [
    typography,
    forms,
  ],
}

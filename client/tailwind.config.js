export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Medscape-inspired professional medical colors
        primary: '#1f3a70', // Deep navy blue (Medscape signature)
        secondary: '#2c5aa0', // Professional medical blue
        accent: '#0066cc', // Bright clinical blue
        success: '#28a745', // Clinical success green
        error: '#dc3545', // Medical alert red
        warning: '#ffc107', // Clinical warning yellow
        
        // Extended Medscape palette
        'medscape-navy': '#1f3a70', // Primary dark blue
        'medscape-blue': '#2c5aa0', // Secondary professional blue
        'medscape-light': '#f8f9fa', // Off-white background
        'medscape-gray': '#6c757d', // Professional gray
        'medscape-border': '#dee2e6', // Light gray borders
        'medscape-text': '#212529', // Dark text
        'clinical-accent': '#0066cc', // Clinical action color
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(31, 58, 112, 0.05)',
        'soft': '0 2px 4px rgba(31, 58, 112, 0.08)',
        'clinical': '0 4px 8px rgba(31, 58, 112, 0.1)',
      },
      fontSize: {
        'xs': ['12px', '16px'],
        'sm': ['14px', '20px'],
        'base': ['15px', '24px'],
        'lg': ['17px', '28px'],
        'xl': ['20px', '28px'],
        '2xl': ['24px', '32px'],
      },
    },
  },
  plugins: [],
};

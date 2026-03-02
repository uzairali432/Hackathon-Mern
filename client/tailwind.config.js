export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Healthcare-focused color palette
        primary: '#0369a1', // Medical blue
        secondary: '#0d9488', // Teal for health/wellness
        accent: '#06b6d4', // Cyan for highlights
        success: '#059669', // Medical green
        error: '#dc2626', // Alert red
        warning: '#f97316', // Warning orange
        
        // Semantic colors
        'medical-dark': '#0c2340', // Dark medical blue
        'medical-light': '#e0f2fe', // Light medical blue
        'health-accent': '#10b981', // Health green
        'chart-primary': '#0284c7', // Chart blue
        'chart-secondary': '#0891b2', // Chart cyan
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'md-soft': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'lg-soft': '0 10px 15px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

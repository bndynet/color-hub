import type { DashboardTheme } from './types';

export const colorblindSafeLightTheme: DashboardTheme = {
  name: 'colorblind-safe-light',
  colorMode: 'light',
  colors: {
    background: '#f9fafb',
    surface: '#ffffff',
    grid: '#e5e7eb',
    axis: '#6b7280',
    textPrimary: '#111827',
    textSecondary: '#374151',
    success: '#009e73',
    warning: '#e69f00',
    danger: '#d55e00',
    info: '#0072b2',
  },
  palette: [
    '#0072b2',
    '#e69f00',
    '#009e73',
    '#d55e00',
    '#cc79a7',
    '#56b4e9',
    '#f0e442',
    '#000000',
    '#5b8ff9',
    '#5ad8a6',
    '#f6bd16',
    '#e8684a',
  ],
  colorMap: {},
};

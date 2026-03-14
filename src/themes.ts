import type { ColorTheme } from './types';

/**
 * Named semantic colors commonly used by chart/dashboard UIs.
 */
export interface DashboardThemeColors {
  background: string;
  surface: string;
  grid: string;
  axis: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export type DashboardTheme = ColorTheme<DashboardThemeColors>;
export type DashboardThemeName =
  | 'dashboard-light'
  | 'dashboard-dark'
  | 'tableau-inspired-light'
  | 'tableau-inspired-dark'
  | 'colorblind-safe-light'
  | 'colorblind-safe-dark';

export const dashboardLightTheme: DashboardTheme = {
  name: 'dashboard-light',
  colorMode: 'light',
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    grid: '#e2e8f0',
    axis: '#64748b',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    info: '#0284c7',
  },
  palette: [
    '#2563eb',
    '#14b8a6',
    '#f97316',
    '#8b5cf6',
    '#e11d48',
    '#0891b2',
    '#65a30d',
    '#ea580c',
    '#4f46e5',
    '#0f766e',
    '#b45309',
    '#7c3aed',
  ],
  colorMap: {},
};

export const dashboardDarkTheme: DashboardTheme = {
  name: 'dashboard-dark',
  colorMode: 'dark',
  colors: {
    background: '#020617',
    surface: '#0f172a',
    grid: '#1e293b',
    axis: '#94a3b8',
    textPrimary: '#e2e8f0',
    textSecondary: '#cbd5e1',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#f43f5e',
    info: '#38bdf8',
  },
  palette: [
    '#60a5fa',
    '#2dd4bf',
    '#fbbf24',
    '#a78bfa',
    '#fb7185',
    '#38bdf8',
    '#a3e635',
    '#fb923c',
    '#818cf8',
    '#14b8a6',
    '#f472b6',
    '#22d3ee',
  ],
  colorMap: {},
};

export const tableauInspiredLightTheme: DashboardTheme = {
  name: 'tableau-inspired-light',
  colorMode: 'light',
  colors: {
    background: '#fcfcfd',
    surface: '#ffffff',
    grid: '#e5e7eb',
    axis: '#6b7280',
    textPrimary: '#111827',
    textSecondary: '#374151',
    success: '#2ca02c',
    warning: '#bc6c25',
    danger: '#d62728',
    info: '#1f77b4',
  },
  palette: [
    '#4e79a7',
    '#f28e2b',
    '#e15759',
    '#76b7b2',
    '#59a14f',
    '#edc948',
    '#b07aa1',
    '#ff9da7',
    '#9c755f',
    '#bab0ab',
    '#2f5d8a',
    '#2e8b57',
  ],
  colorMap: {},
};

export const tableauInspiredDarkTheme: DashboardTheme = {
  name: 'tableau-inspired-dark',
  colorMode: 'dark',
  colors: {
    background: '#0b1020',
    surface: '#111827',
    grid: '#253045',
    axis: '#9ca3af',
    textPrimary: '#f3f4f6',
    textSecondary: '#d1d5db',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#fb7185',
    info: '#60a5fa',
  },
  palette: [
    '#79aee3',
    '#ffb45c',
    '#ff7a7a',
    '#91d4cf',
    '#7bc96f',
    '#ffe17d',
    '#d5a6d3',
    '#ffb6bf',
    '#c79d7b',
    '#d2c7c1',
    '#5f8fd1',
    '#3fae86',
  ],
  colorMap: {},
};

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

export const colorblindSafeDarkTheme: DashboardTheme = {
  name: 'colorblind-safe-dark',
  colorMode: 'dark',
  colors: {
    background: '#030712',
    surface: '#111827',
    grid: '#1f2937',
    axis: '#9ca3af',
    textPrimary: '#f9fafb',
    textSecondary: '#d1d5db',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f97316',
    info: '#60a5fa',
  },
  palette: [
    '#60a5fa',
    '#fbbf24',
    '#34d399',
    '#fb923c',
    '#f472b6',
    '#7dd3fc',
    '#fde047',
    '#e5e7eb',
    '#818cf8',
    '#2dd4bf',
    '#f59e0b',
    '#fb7185',
  ],
  colorMap: {},
};

/**
 * Ready-to-use themes for analytics charts and dashboards.
 */
export const dashboardThemes: DashboardTheme[] = [
  dashboardLightTheme,
  dashboardDarkTheme,
  tableauInspiredLightTheme,
  tableauInspiredDarkTheme,
  colorblindSafeLightTheme,
  colorblindSafeDarkTheme,
];

/**
 * Fast lookup for single-theme usage.
 *
 * Example:
 *   const dark = dashboardThemesByName['dashboard-dark'];
 */
export const dashboardThemesByName: Record<string, DashboardTheme> =
  {
    'dashboard-light': dashboardLightTheme,
    'dashboard-dark': dashboardDarkTheme,
    'tableau-inspired-light': tableauInspiredLightTheme,
    'tableau-inspired-dark': tableauInspiredDarkTheme,
    'colorblind-safe-light': colorblindSafeLightTheme,
    'colorblind-safe-dark': colorblindSafeDarkTheme,
  };

/**
 * Get one built-in chart/dashboard theme by name.
 * Throws when name does not exist to fail fast in app setup.
 */
export function getDashboardTheme(name: DashboardThemeName): DashboardTheme {
  const theme = dashboardThemesByName[name];
  return theme;
}


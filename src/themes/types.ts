import type { ColorTheme } from '../types';

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

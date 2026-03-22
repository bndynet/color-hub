import type { DashboardTheme, DashboardThemeName } from './types';
import { dashboardLightTheme } from './dashboard-light';
import { dashboardDarkTheme } from './dashboard-dark';
import { tableauInspiredLightTheme } from './tableau-inspired-light';
import { tableauInspiredDarkTheme } from './tableau-inspired-dark';
import { colorblindSafeLightTheme } from './colorblind-safe-light';
import { colorblindSafeDarkTheme } from './colorblind-safe-dark';

export type {
  DashboardThemeColors,
  DashboardTheme,
  DashboardThemeName,
} from './types';

export { dashboardLightTheme } from './dashboard-light';
export { dashboardDarkTheme } from './dashboard-dark';
export { tableauInspiredLightTheme } from './tableau-inspired-light';
export { tableauInspiredDarkTheme } from './tableau-inspired-dark';
export { colorblindSafeLightTheme } from './colorblind-safe-light';
export { colorblindSafeDarkTheme } from './colorblind-safe-dark';

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
export const dashboardThemesByName: Record<string, DashboardTheme> = {
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

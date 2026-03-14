import { describe, it, expect } from 'vitest';
import { ColorHub } from '../src/color-hub';
import {
  dashboardThemes,
  dashboardThemesByName,
  getDashboardTheme,
  type DashboardThemeColors,
} from '../src/themes';

describe('dashboardThemes', () => {
  it('contains multiple ready-to-use themes', () => {
    expect(dashboardThemes.length).toBeGreaterThanOrEqual(6);
  });

  it('provides both light and dark themes', () => {
    const modes = new Set(dashboardThemes.map((theme) => theme.colorMode));
    expect(modes.has('light')).toBe(true);
    expect(modes.has('dark')).toBe(true);
  });

  it('ensures each theme has semantic named colors and palette', () => {
    for (const theme of dashboardThemes) {
      expect(theme.colors).toBeTruthy();
      expect(theme.palette?.length).toBeGreaterThanOrEqual(10);
      expect(theme.colorMap).toEqual({});

      const colors = theme.colors as DashboardThemeColors;
      expect(colors.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.surface).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.grid).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.axis).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.textPrimary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(colors.textSecondary).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('can be used directly with ColorHub', () => {
    const hub = new ColorHub(dashboardThemes);
    hub.switchTheme('dashboard-light');
    const c1 = hub.getColors('Revenue');
    const c2 = hub.getColors('Cost');

    expect(c1.default).toMatch(/^#[0-9a-f]{6}$/i);
    expect(c2.default).toMatch(/^#[0-9a-f]{6}$/i);
    expect(c1.default).not.toBe(c2.default);
  });

  it('supports direct single-theme lookup by name', () => {
    const theme = dashboardThemesByName['dashboard-dark'];
    expect(theme).toBeTruthy();
    expect(theme.name).toBe('dashboard-dark');
  });

  it('supports direct single-theme getter', () => {
    const theme = getDashboardTheme('dashboard-light');
    expect(theme.name).toBe('dashboard-light');
  });
});


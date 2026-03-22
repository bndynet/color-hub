import { describe, it, expect } from 'vitest';
import { toCSSVariables, toCSSString } from '../src/css';
import type { ColorTheme } from '../src/types';

interface AppColors {
  background: string;
  textPrimary: string;
}

const theme: ColorTheme<AppColors> = {
  name: 'demo',
  colorMode: 'light',
  colors: {
    background: '#ffffff',
    textPrimary: '#111827',
  },
  palette: ['#2563eb', '#16a34a'],
  colorMap: { 'Series A': '#2563eb' },
};

describe('toCSSVariables', () => {
  it('maps named colors with a default prefix and kebab-cased keys', () => {
    const vars = toCSSVariables(theme);
    expect(vars['--ch-background']).toBe('#ffffff');
    expect(vars['--ch-text-primary']).toBe('#111827');
  });

  it('respects a custom prefix', () => {
    const vars = toCSSVariables(theme, { prefix: 'app' });
    expect(vars['--app-background']).toBe('#ffffff');
  });

  it('optionally emits palette variables', () => {
    const vars = toCSSVariables(theme, { includePalette: true });
    expect(vars['--ch-palette-0']).toBe('#2563eb');
    expect(vars['--ch-palette-1']).toBe('#16a34a');
  });

  it('optionally emits sanitized colorMap variables', () => {
    const vars = toCSSVariables(theme, { includeColorMap: true });
    expect(vars['--ch-series-a']).toBe('#2563eb');
  });

  it('ignores colors when absent', () => {
    const vars = toCSSVariables({ name: 'empty', palette: [], colorMap: {} });
    expect(Object.keys(vars)).toHaveLength(0);
  });
});

describe('toCSSString', () => {
  it('wraps variables in the default :root selector', () => {
    const css = toCSSString(theme);
    expect(css.startsWith(':root {')).toBe(true);
    expect(css).toContain('--ch-background: #ffffff;');
    expect(css.trimEnd().endsWith('}')).toBe(true);
  });

  it('supports a custom selector', () => {
    const css = toCSSString(theme, { selector: '[data-theme="demo"]' });
    expect(css.startsWith('[data-theme="demo"] {')).toBe(true);
  });
});

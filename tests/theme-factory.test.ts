import { describe, it, expect } from 'vitest';
import { colord } from 'colord';
import { createThemeFromColor, deriveDarkTheme } from '../src/theme-factory';
import type { ColorTheme } from '../src/types';

describe('createThemeFromColor', () => {
  it('returns a light/dark pair with correct names and modes', () => {
    const { light, dark } = createThemeFromColor('#2563eb', { name: 'brand' });
    expect(light.name).toBe('brand-light');
    expect(dark.name).toBe('brand-dark');
    expect(light.colorMode).toBe('light');
    expect(dark.colorMode).toBe('dark');
  });

  it('anchors the base as the first light palette color', () => {
    const { light } = createThemeFromColor('#2563eb');
    expect(light.palette?.[0]).toBe(colord('#2563eb').toHex());
  });

  it('generates the requested palette size with valid, distinct colors', () => {
    const { light } = createThemeFromColor('#2563eb', { paletteSize: 6 });
    expect(light.palette).toHaveLength(6);
    light.palette?.forEach((c) => expect(c).toMatch(/^#[0-9a-f]{6}$/i));
    expect(new Set(light.palette).size).toBe(6);
  });

  it('dark palette is at least as light as the light palette per slot', () => {
    const { light, dark } = createThemeFromColor('#1a1a8a', { paletteSize: 4 });
    light.palette?.forEach((c, i) => {
      const ld = colord(dark.palette![i]).toHsl().l;
      const ll = colord(c).toHsl().l;
      expect(ld).toBeGreaterThanOrEqual(ll - 1e-6);
    });
  });

  it('starts with empty colorMap', () => {
    const { light, dark } = createThemeFromColor('#2563eb');
    expect(light.colorMap).toEqual({});
    expect(dark.colorMap).toEqual({});
  });
});

describe('deriveDarkTheme', () => {
  it('flips colorMode and clones colorMap', () => {
    const light: ColorTheme = {
      name: 'x',
      colorMode: 'light',
      palette: ['#2563eb'],
      colorMap: { a: '#2563eb' },
    };
    const dark = deriveDarkTheme(light);
    expect(dark.colorMode).toBe('dark');
    expect(dark.colorMap).toEqual({ a: '#2563eb' });
    expect(dark.colorMap).not.toBe(light.colorMap);
  });

  it('inverts named colors lightness', () => {
    const light: ColorTheme<{ background: string }> = {
      name: 'x',
      colorMode: 'light',
      colors: { background: '#ffffff' },
      palette: [],
      colorMap: {},
    };
    const dark = deriveDarkTheme(light);
    expect(colord(dark.colors!.background).brightness()).toBeLessThan(
      colord('#ffffff').brightness(),
    );
  });
});

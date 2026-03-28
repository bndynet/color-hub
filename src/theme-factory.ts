/**
 * Generate a usable light/dark theme pair from a single brand color.
 *
 * The package stays unopinionated: the factory only produces a distinguishable
 * `palette` (for chart-series / key assignment) plus the `colorMode` flag. Semantic
 * tokens (background, text, status colors) are intentionally left to the consumer.
 */
import { colord } from 'colord';
import type { ColorTheme } from './types';
import { invert } from './utils';

/** Golden-angle hue step → well-spread, easy-to-distinguish palette colors. */
const GOLDEN_ANGLE = 137.508;

export type CreateThemeOptions = {
  /** Base theme name; `-light` / `-dark` are appended. Default `theme`. */
  name?: string;
  /** Number of palette colors to generate. Default `8`. */
  paletteSize?: number;
  /** HSL saturation (0–100) for generated palette colors. Default `65`. */
  saturation?: number;
};

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Lift dark colors toward a mid lightness so the palette reads on dark backgrounds. */
function adaptForDark(color: string): string {
  const hsl = colord(color).toHsl();
  if (hsl.l < 55) {
    return colord({ ...hsl, l: Math.min(70, hsl.l + 25) }).toHex();
  }
  return colord(color).toHex();
}

/**
 * Derive a dark variant of a theme: flips `colorMode` to `dark`, mirrors any named
 * `colors` lightness via {@link invert}, and lifts palette colors for dark backgrounds.
 * `name` and `colorMap` are preserved (assignments are cloned).
 */
export function deriveDarkTheme<T>(light: ColorTheme<T>): ColorTheme<T> {
  let colors = light.colors;
  if (isStringRecord(light.colors)) {
    const mapped: Record<string, unknown> = { ...light.colors };
    for (const [key, value] of Object.entries(light.colors)) {
      if (typeof value === 'string') {
        mapped[key] = invert(value);
      }
    }
    colors = mapped as T;
  }
  return {
    ...light,
    colorMode: 'dark',
    colors,
    palette: (light.palette ?? []).map(adaptForDark),
    colorMap: { ...(light.colorMap ?? {}) },
  };
}

/**
 * Build a `{ light, dark }` theme pair from one base color. The base anchors
 * `palette[0]` of the light theme; remaining colors are spread by the golden angle
 * for good pairwise separation. The dark theme is derived via {@link deriveDarkTheme}.
 */
export function createThemeFromColor(
  base: string,
  options?: CreateThemeOptions,
): { light: ColorTheme; dark: ColorTheme } {
  const name = options?.name ?? 'theme';
  const size = Math.max(1, Math.floor(options?.paletteSize ?? 8));
  const saturation = options?.saturation ?? 65;
  const baseHue = colord(base).toHsl().h;

  const palette = [colord(base).toHex()];
  for (let i = 1; i < size; i++) {
    const hue = (baseHue + i * GOLDEN_ANGLE) % 360;
    palette.push(colord({ h: hue, s: saturation, l: 45 }).toHex());
  }

  const light: ColorTheme = {
    name: `${name}-light`,
    colorMode: 'light',
    palette,
    colorMap: {},
  };
  const dark: ColorTheme = { ...deriveDarkTheme(light), name: `${name}-dark` };

  return { light, dark };
}

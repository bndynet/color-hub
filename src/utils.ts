import { colord, type AnyColor } from 'colord';

export function alpha(color: string, alpha: number): string {
  return colord(color).alpha(alpha).toHex();
}

export function lighten(color: string, amount: number): string {
  return colord(color).lighten(amount).toHex();
}

export function darken(color: string, amount: number): string {
  return colord(color).darken(amount).toHex();
}

export function saturate(color: string, amount: number): string {
  return colord(color).saturate(amount).toHex();
}

export function desaturate(color: string, amount: number): string {
  return colord(color).desaturate(amount).toHex();
}

export function invert(color: string): string {
  return colord(color).invert().toHex();
}

export function grayscale(color: string): string {
  return colord(color).grayscale().toHex();
}

/** Rotate HSL hue in degrees (e.g. 180 for complementary on the color wheel). */
export function rotateHue(color: string, degrees: number): string {
  return colord(color).rotate(degrees).toHex();
}

/**
 * Interpolate **sRGB channels** (0–255) linearly — i.e. gamma-encoded values, not linear-light RGB.
 * For perceptually smoother ramps, use {@link mixOklab} / {@link colorStepsOklch}.
 */
export function mix(color1: string, color2: string, ratio = 0.5): string {
  const t = Math.max(0, Math.min(1, ratio));
  const a = colord(color1).toRgb();
  const b = colord(color2).toRgb();
  return colord({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
    a: a.a + (b.a - a.a) * t,
  }).toHex();
}

/** WCAG 2.x relative luminance for sRGB (0 = black, 1 = white). */
function relativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const lin = (c: number) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  const r = lin(rgb.r);
  const g = lin(rgb.g);
  const b = lin(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colors (1–21). */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(colord(foreground).toRgb());
  const l2 = relativeLuminance(colord(background).toRgb());
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick a readable foreground (default black/white) for a solid background.
 * Uses colord’s perceived brightness (aligned with common UI patterns).
 */
export function contrastText(
  background: string,
  options?: { light?: string; dark?: string },
): string {
  const light = options?.light ?? '#ffffff';
  const dark = options?.dark ?? '#000000';
  return colord(background).isDark() ? light : dark;
}

/** Perceived brightness 0–1 (colord / WCAG-derived). */
export function brightness(color: string): number {
  return colord(color).brightness();
}

export function isValidColor(input: AnyColor): boolean {
  return colord(input).isValid();
}

export function isDark(color: string): boolean {
  return colord(color).isDark();
}

export function isLight(color: string): boolean {
  return colord(color).isLight();
}

/** `rgba` / `hsla` channels for CSS or canvas (`r`/`g`/`b` 0–255, `a` 0–1). */
export function toRgb(color: string) {
  return colord(color).toRgb();
}

/** Evenly spaced {@link mix} samples from `from` to `to` (inclusive). `steps` ≥ 2. */
export function colorSteps(from: string, to: string, steps: number): string[] {
  const n = Math.max(2, Math.floor(steps));
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(mix(from, to, n === 1 ? 0 : i / (n - 1)));
  }
  return out;
}

/**
 * Generate random color - Option 1: fully random (simplest).
 * Use for: quick prototypes when color quality does not matter.
 */
export function randomColor(): string {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return `#${('000000' + hex).slice(-6)}`;
}

/**
 * Generate random color - Option 2: HSL-controlled (recommended for charts).
 * Use for: vivid, high-contrast colors.
 * @param saturation 0-100, default 70 (vivid but not harsh)
 * @param lightness 0-100, default 50 (medium brightness)
 */
export function randomChartColor(saturation = 70, lightness = 50): string {
  const hue = Math.floor(Math.random() * 360);
  return colord({ h: hue, s: saturation, l: lightness }).toHex();
}

/**
 * Generate random color - Option 3: golden-ratio (best visual spread).
 * Use for: multiple colors that are evenly distributed and easy to distinguish.
 * Uses golden ratio for hue to keep colors well spread.
 */
export function randomDistinctColor(): string {
  const goldenRatio = 0.618033988749895;
  const hue = (Math.random() + goldenRatio) % 1;
  return colord({ h: hue * 360, s: 70, l: 50 }).toHex();
}

/** CIE Lab f(t) for XYZ ratio t. */
function labF(t: number): number {
  return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
}

/** sRGB → CIELAB (D65). */
function rgbToLab(rgb: { r: number; g: number; b: number }): {
  l: number;
  a: number;
  b: number;
} {
  const lin = (c: number) => {
    const x = c / 255;
    return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  const r = lin(rgb.r);
  const g = lin(rgb.g);
  const b = lin(rgb.b);
  const X = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const Y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const Z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
  const fx = labF(X / 0.95047);
  const fy = labF(Y / 1.0);
  const fz = labF(Z / 1.08883);
  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * CIELAB ΔE76 (Euclidean in L*a*b*). Coarser than ΔE00 but cheap and dependency-free.
 * For stricter “just noticeable” control, use CIEDE2000 (e.g. culori) in app code.
 */
export function deltaE76(color1: string, color2: string): number {
  const p = rgbToLab(colord(color1).toRgb());
  const q = rgbToLab(colord(color2).toRgb());
  const dL = p.l - q.l;
  const dA = p.a - q.a;
  const dB = p.b - q.b;
  return Math.sqrt(dL * dL + dA * dA + dB * dB);
}

/** Minimum ΔE76 from `candidate` to any color in `existing`. */
export function minDeltaE76ToExisting(
  candidate: string,
  existing: string[],
): number {
  if (existing.length === 0) {
    return Number.POSITIVE_INFINITY;
  }
  let m = Number.POSITIVE_INFINITY;
  for (const e of existing) {
    const d = deltaE76(candidate, e);
    if (d < m) {
      m = d;
    }
  }
  return m;
}

/**
 * Pick a saturated chart-like color whose minimum ΔE76 to `existing` is at least `minDeltaE`.
 * Falls back to `randomDistinctColor()` after `maxAttempts`. For publication-grade colorblind-safe
 * palettes, combine with Paul Tol’s schemes or a dedicated CB palette; this improves pairwise spread vs golden hue alone.
 */
export function distinctColorPerceptual(
  existing: string[],
  options?: { minDeltaE?: number; maxAttempts?: number },
): string {
  const minDE = options?.minDeltaE ?? 23;
  const maxAttempts = options?.maxAttempts ?? 100;
  const valid = existing.filter((c) => isValidColor(c));
  if (valid.length === 0) {
    return randomDistinctColor();
  }
  const golden = 0.618033988749895;
  for (let i = 0; i < maxAttempts; i++) {
    const hue = (i * golden * 360 + Math.random() * 30) % 360;
    const sat = 55 + (i % 5) * 5;
    const light = 45 + (i % 3) * 5;
    const c = colord({ h: hue, s: sat, l: light }).toHex();
    if (minDeltaE76ToExisting(c, valid) >= minDE) {
      return c;
    }
  }
  return randomDistinctColor();
}

/** Built-in ECharts-style chart palette (fixed order). */
const CHART_PALETTE = [
  '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE',
  '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#F39C12',
  '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6', '#1ABC9C',
  '#E67E22', '#34495E', '#16A085', '#27AE60', '#2980B9',
] as const;

export type RandomPaletteColorOptions = {
  /**
   * Colors already in use; the next pick maximizes the minimum CIELAB ΔE76 to these
   * (best “furthest from all” within the fixed palette).
   */
  recent?: string[];
};

/**
 * Pick a color from the built-in chart palette.
 * - With no `recent`: uniform random (same as before).
 * - With `recent`: chooses the palette entry whose **minimum** ΔE76 to any recent color
 *   is as large as possible, so consecutive / simultaneous picks stay easy to tell apart.
 */
export function randomPaletteColor(options?: RandomPaletteColorOptions): string {
  const palette = CHART_PALETTE as readonly string[];
  const recent = (options?.recent ?? []).filter((c) => isValidColor(c));
  if (recent.length === 0) {
    return palette[Math.floor(Math.random() * palette.length)]!;
  }
  let best = -1;
  const bestAt: string[] = [];
  for (const c of palette) {
    const d = minDeltaE76ToExisting(c, recent);
    if (d > best) {
      best = d;
      bestAt.length = 0;
      bestAt.push(c);
    } else if (d === best) {
      bestAt.push(c);
    }
  }
  return bestAt[Math.floor(Math.random() * bestAt.length)]!;
}

/**
 * Returns a function that picks from the same built-in palette while avoiding overlap with
 * the last `memory` picks (same rule as `randomPaletteColor({ recent })`).
 */
export function createPaletteColorPicker(options?: {
  /** How many recent colors to compare against (ring buffer). Default 16. */
  memory?: number;
}): () => string {
  const memory = Math.max(1, options?.memory ?? 16);
  const recent: string[] = [];
  return () => {
    const c = randomPaletteColor({ recent: [...recent] });
    recent.push(c);
    if (recent.length > memory) {
      recent.shift();
    }
    return c;
  };
}

export {
  mixOklab,
  mixOklch,
  colorStepsOklch,
  colorStepsOklab,
} from './oklch-mix';

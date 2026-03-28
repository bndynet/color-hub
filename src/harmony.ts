/**
 * Color harmony (color-wheel scheme) generators.
 *
 * Each function takes one base color and returns an array of CSS hex colors with
 * the base as the first element, built from HSL hue rotations ({@link rotateHue}).
 * `monochromatic` instead varies lightness via {@link generateScale}.
 */
import { colord } from 'colord';
import { rotateHue } from './utils';
import { generateScale, type ScaleStop } from './scale';

export type HarmonyScheme =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'split-complementary'
  | 'monochromatic';

function hex(color: string): string {
  return colord(color).toHex();
}

/** Base + its opposite (180°). */
export function complementary(base: string): string[] {
  return [hex(base), rotateHue(base, 180)];
}

/** Base + two neighbors at ±`angle` (default 30°). */
export function analogous(base: string, angle = 30): string[] {
  return [hex(base), rotateHue(base, angle), rotateHue(base, -angle)];
}

/** Three colors evenly spaced 120° apart. */
export function triadic(base: string): string[] {
  return [hex(base), rotateHue(base, 120), rotateHue(base, 240)];
}

/** Rectangle scheme: base, +60°, +180°, +240°. */
export function tetradic(base: string): string[] {
  return [hex(base), rotateHue(base, 60), rotateHue(base, 180), rotateHue(base, 240)];
}

/** Base + the two colors adjacent to its complement (+150°, +210°). */
export function splitComplementary(base: string): string[] {
  return [hex(base), rotateHue(base, 150), rotateHue(base, 210)];
}

const MONO_STOPS: ScaleStop[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * `count` shades of the same hue (light → dark), sampled from {@link generateScale}.
 * `count` is clamped to `[2, 11]`.
 */
export function monochromatic(base: string, count = 5): string[] {
  const n = Math.max(2, Math.min(11, Math.floor(count)));
  const scale = generateScale(base);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.round((i / (n - 1)) * (MONO_STOPS.length - 1));
    out.push(scale[MONO_STOPS[idx]]);
  }
  return out;
}

/** Dispatch to a harmony scheme by name. */
export function harmony(
  base: string,
  scheme: HarmonyScheme,
  options?: { angle?: number; count?: number },
): string[] {
  switch (scheme) {
    case 'complementary':
      return complementary(base);
    case 'analogous':
      return analogous(base, options?.angle);
    case 'triadic':
      return triadic(base);
    case 'tetradic':
      return tetradic(base);
    case 'split-complementary':
      return splitComplementary(base);
    case 'monochromatic':
      return monochromatic(base, options?.count);
  }
}

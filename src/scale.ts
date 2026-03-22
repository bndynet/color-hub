/**
 * Single-color tonal scale generation (e.g. Tailwind / Ant Design / Material-style
 * 50–950 shades) from one base color.
 *
 * Steps are produced by blending the base toward white (lighter stops) and toward
 * black (darker stops) in **Oklab**, so the ramp stays perceptually smoother and the
 * hue drifts far less than naive HSL lightening/darkening. Reuses {@link mixOklab}.
 */
import { colord } from 'colord';
import { mixOklab } from './oklch-mix';

/** Tailwind-like tonal stops. The base color anchors stop {@link 500}. */
export type ScaleStop =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

/** A full tonal scale: stop → hex color. */
export type ColorScale = Record<ScaleStop, string>;

const WHITE = '#ffffff';
const BLACK = '#000000';

/**
 * Blend amount per stop relative to the base.
 * - Positive: fraction blended toward white (lighter than base).
 * - Zero: the base color itself.
 * - Negative: fraction blended toward black (darker than base).
 */
const SCALE_MIX: Record<ScaleStop, number> = {
  50: 0.95,
  100: 0.88,
  200: 0.74,
  300: 0.55,
  400: 0.3,
  500: 0,
  600: -0.13,
  700: -0.27,
  800: -0.42,
  900: -0.56,
  950: -0.7,
};

const SCALE_STOPS = Object.keys(SCALE_MIX).map(Number) as ScaleStop[];

export type GenerateScaleOptions = {
  /**
   * Override blend amounts per stop (merged over the defaults).
   * Positive → toward white, negative → toward black, `0` → the base color.
   */
  mix?: Partial<Record<ScaleStop, number>>;
};

/**
 * Generate an 11-stop tonal scale (50–950) from a single base color.
 * The base anchors stop `500`; lighter stops blend toward white and darker stops
 * toward black, all in Oklab for a smoother, hue-stable ramp.
 *
 * @example
 *   const blue = generateScale('#2563eb');
 *   blue[500]; // ~ '#2563eb'
 *   blue[50];  // very light tint
 *   blue[900]; // deep shade
 */
export function generateScale(
  base: string,
  options?: GenerateScaleOptions,
): ColorScale {
  const baseHex = colord(base).toHex();
  const out = {} as ColorScale;
  for (const stop of SCALE_STOPS) {
    const amount = options?.mix?.[stop] ?? SCALE_MIX[stop];
    if (amount === 0) {
      out[stop] = baseHex;
    } else if (amount > 0) {
      out[stop] = mixOklab(baseHex, WHITE, amount);
    } else {
      out[stop] = mixOklab(baseHex, BLACK, -amount);
    }
  }
  return out;
}

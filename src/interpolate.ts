/**
 * Continuous color interpolation over **user-supplied** stop colors.
 *
 * The library ships no built-in palettes (no Viridis etc.) — you pass your own
 * stops. Interpolation defaults to **Oklab** (perceptually smooth, via
 * {@link mixOklab}); pass `space: 'srgb'` for raw channel mixing.
 *
 * Typical uses: heatmaps, choropleth maps, and any value→color mapping where you
 * need a color for an arbitrary `t` in `[0, 1]`.
 */
import { colord } from 'colord';
import { mixOklab } from './oklch-mix';
import { mix } from './utils';

/** Interpolation color space. */
export type InterpolateSpace = 'oklab' | 'srgb';

export type InterpolateOptions = {
  /** Interpolation space (default `'oklab'`). */
  space?: InterpolateSpace;
};

function mixIn(
  space: InterpolateSpace,
  from: string,
  to: string,
  t: number,
): string {
  return space === 'srgb' ? mix(from, to, t) : mixOklab(from, to, t);
}

/**
 * Build an interpolator over an ordered list of stop colors. The returned
 * function maps `t` in `[0, 1]` (clamped) to a hex color, distributing the stops
 * evenly across the range.
 *
 * @throws if `stops` is empty.
 * @example
 *   const heat = createInterpolator(['#2563eb', '#facc15', '#dc2626']);
 *   heat(0);   // ≈ '#2563eb'
 *   heat(0.5); // ≈ '#facc15'
 *   heat(1);   // ≈ '#dc2626'
 */
export function createInterpolator(
  stops: string[],
  options?: InterpolateOptions,
): (t: number) => string {
  if (stops.length === 0) {
    throw new Error('createInterpolator requires at least one stop color');
  }
  const space = options?.space ?? 'oklab';
  if (stops.length === 1) {
    const only = colord(stops[0]).toHex();
    return () => only;
  }
  const segments = stops.length - 1;
  return (t: number) => {
    const clamped = Math.max(0, Math.min(1, t));
    const scaled = clamped * segments;
    let idx = Math.floor(scaled);
    if (idx >= segments) {
      idx = segments - 1;
    }
    return mixIn(space, stops[idx], stops[idx + 1], scaled - idx);
  };
}

/**
 * Take `n` evenly spaced samples across the stops (inclusive endpoints).
 * Generalizes {@link colorSteps} / {@link colorStepsOklch} to more than two stops.
 * `n` is clamped to `≥ 1`.
 */
export function sample(
  stops: string[],
  n: number,
  options?: InterpolateOptions,
): string[] {
  const count = Math.max(1, Math.floor(n));
  const interp = createInterpolator(stops, options);
  if (count === 1) {
    return [interp(0)];
  }
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(interp(i / (count - 1)));
  }
  return out;
}

/**
 * Build a **diverging** interpolator with a fixed midpoint: `low` at `t = 0`,
 * `mid` at `t = 0.5`, `high` at `t = 1`. Ideal for signed data (e.g. -1…+1
 * correlation, profit/loss) on heatmaps and choropleths.
 */
export function createDivergingInterpolator(
  low: string,
  mid: string,
  high: string,
  options?: InterpolateOptions,
): (t: number) => string {
  return createInterpolator([low, mid, high], options);
}

import { describe, it, expect } from 'vitest';
import { colord } from 'colord';
import { generateScale, type ScaleStop } from '../src/scale';

const STOPS: ScaleStop[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

describe('generateScale', () => {
  it('returns all 11 stops as valid hex colors', () => {
    const scale = generateScale('#2563eb');
    for (const stop of STOPS) {
      expect(scale[stop]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('anchors the base color at stop 500', () => {
    const base = '#2563eb';
    expect(generateScale(base)[500]).toBe(colord(base).toHex());
  });

  it('decreases in brightness from 50 down to 950', () => {
    const scale = generateScale('#2563eb');
    for (let i = 1; i < STOPS.length; i++) {
      const prev = colord(scale[STOPS[i - 1]]).brightness();
      const curr = colord(scale[STOPS[i]]).brightness();
      expect(curr).toBeLessThanOrEqual(prev + 1e-6);
    }
  });

  it('keeps a light tint at 50 and a deep shade at 900', () => {
    const scale = generateScale('#2563eb');
    expect(colord(scale[50]).brightness()).toBeGreaterThan(
      colord(scale[500]).brightness(),
    );
    expect(colord(scale[900]).brightness()).toBeLessThan(
      colord(scale[500]).brightness(),
    );
  });

  it('roughly preserves hue across the ramp', () => {
    const baseHue = colord('#2563eb').hue();
    const scale = generateScale('#2563eb');
    for (const stop of [200, 400, 600, 800] as ScaleStop[]) {
      expect(Math.abs(colord(scale[stop]).hue() - baseHue)).toBeLessThan(25);
    }
  });

  it('honors custom mix overrides', () => {
    const scale = generateScale('#2563eb', { mix: { 50: 0 } });
    expect(scale[50]).toBe(colord('#2563eb').toHex());
  });
});

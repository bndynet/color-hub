import { describe, it, expect } from 'vitest';
import { colord } from 'colord';
import {
  harmony,
  complementary,
  analogous,
  triadic,
  tetradic,
  splitComplementary,
  monochromatic,
} from '../src/harmony';

const base = '#2563eb';
const baseHue = colord(base).hue();

function hueOffset(color: string): number {
  return ((colord(color).hue() - baseHue + 540) % 360) - 180;
}

describe('harmony', () => {
  it('complementary returns base + 180°', () => {
    const [b, comp] = complementary(base);
    expect(b).toBe(colord(base).toHex());
    expect(Math.abs(Math.abs(hueOffset(comp)) - 180)).toBeLessThan(1);
  });

  it('analogous returns base and ±angle neighbors', () => {
    const [b, plus, minus] = analogous(base, 30);
    expect(b).toBe(colord(base).toHex());
    expect(hueOffset(plus)).toBeCloseTo(30, 0);
    expect(hueOffset(minus)).toBeCloseTo(-30, 0);
  });

  it('triadic returns three colors 120° apart', () => {
    const colors = triadic(base);
    expect(colors).toHaveLength(3);
    expect(hueOffset(colors[1])).toBeCloseTo(120, 0);
    expect(hueOffset(colors[2])).toBeCloseTo(-120, 0); // 240° ≡ -120°
  });

  it('tetradic returns four colors', () => {
    expect(tetradic(base)).toHaveLength(4);
  });

  it('splitComplementary returns base + 150° / 210°', () => {
    const colors = splitComplementary(base);
    expect(colors).toHaveLength(3);
    expect(hueOffset(colors[1])).toBeCloseTo(150, 0);
    expect(hueOffset(colors[2])).toBeCloseTo(-150, 0); // 210° ≡ -150°
  });

  it('monochromatic keeps hue and varies lightness', () => {
    const colors = monochromatic(base, 5);
    expect(colors).toHaveLength(5);
    const lightnesses = colors.map((c) => colord(c).toHsl().l);
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeLessThanOrEqual(lightnesses[i - 1] + 1e-6);
    }
  });

  it('monochromatic clamps count to [2, 11]', () => {
    expect(monochromatic(base, 1)).toHaveLength(2);
    expect(monochromatic(base, 99)).toHaveLength(11);
  });

  it('harmony dispatches by scheme name', () => {
    expect(harmony(base, 'triadic')).toEqual(triadic(base));
    expect(harmony(base, 'analogous', { angle: 45 })).toEqual(
      analogous(base, 45),
    );
    expect(harmony(base, 'monochromatic', { count: 4 })).toEqual(
      monochromatic(base, 4),
    );
  });
});

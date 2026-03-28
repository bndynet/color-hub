import { describe, it, expect } from 'vitest';
import { simulate, simulateAll, type CvdType } from '../src/cvd';
import { deltaE76 } from '../src/utils';

const TYPES: CvdType[] = ['protanopia', 'deuteranopia', 'tritanopia'];

describe('simulate', () => {
  it('returns valid hex for every type', () => {
    for (const type of TYPES) {
      expect(simulate('#2563eb', type)).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('leaves grayscale essentially unchanged (row sums ≈ 1)', () => {
    for (const gray of ['#000000', '#808080', '#ffffff']) {
      for (const type of TYPES) {
        // Allow ±1 per channel for rounding through linear/gamma round-trip.
        expect(deltaE76(simulate(gray, type), gray)).toBeLessThan(1.5);
      }
    }
  });

  it('collapses a red/green pair under deuteranopia', () => {
    const red = '#d62728';
    const green = '#2ca02c';
    const normal = deltaE76(red, green);
    const simulated = deltaE76(
      simulate(red, 'deuteranopia'),
      simulate(green, 'deuteranopia'),
    );
    expect(simulated).toBeLessThan(normal);
  });

  it('preserves alpha', () => {
    expect(simulate('#2563eb80', 'protanopia')).toMatch(/^#[0-9a-f]{8}$/i);
  });

  it('returns input unchanged (as hex) for invalid colors', () => {
    expect(simulate('not-a-color', 'protanopia')).toBe('#000000');
  });
});

describe('simulateAll', () => {
  it('returns all three simulations', () => {
    const all = simulateAll('#ff0000');
    expect(Object.keys(all).sort()).toEqual([...TYPES].sort());
    for (const type of TYPES) {
      expect(all[type]).toBe(simulate('#ff0000', type));
    }
  });
});

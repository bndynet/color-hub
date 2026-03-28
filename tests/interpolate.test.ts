import { describe, it, expect } from 'vitest';
import { colord } from 'colord';
import {
  createInterpolator,
  sample,
  createDivergingInterpolator,
} from '../src/interpolate';
import { mixOklab } from '../src/oklch-mix';
import { mix } from '../src/utils';

describe('createInterpolator', () => {
  it('throws on empty stops', () => {
    expect(() => createInterpolator([])).toThrow();
  });

  it('returns the single stop (as hex) for any t', () => {
    const interp = createInterpolator(['#2563eb']);
    expect(interp(0)).toBe(colord('#2563eb').toHex());
    expect(interp(0.5)).toBe(colord('#2563eb').toHex());
    expect(interp(1)).toBe(colord('#2563eb').toHex());
  });

  it('hits exact endpoints for two stops', () => {
    const interp = createInterpolator(['#ff0000', '#0000ff']);
    expect(interp(0)).toBe(mixOklab('#ff0000', '#0000ff', 0));
    expect(interp(1)).toBe(mixOklab('#ff0000', '#0000ff', 1));
  });

  it('clamps t outside [0, 1]', () => {
    const interp = createInterpolator(['#ff0000', '#0000ff']);
    expect(interp(-1)).toBe(interp(0));
    expect(interp(2)).toBe(interp(1));
  });

  it('lands on an interior stop at its boundary (3 stops)', () => {
    const interp = createInterpolator(['#ff0000', '#00ff00', '#0000ff']);
    expect(interp(0.5)).toBe(colord('#00ff00').toHex());
  });

  it('supports the srgb space', () => {
    const interp = createInterpolator(['#ff0000', '#0000ff'], { space: 'srgb' });
    expect(interp(0.5)).toBe(mix('#ff0000', '#0000ff', 0.5));
  });
});

describe('sample', () => {
  it('returns n samples with inclusive endpoints', () => {
    const colors = sample(['#ff0000', '#00ff00', '#0000ff'], 5);
    expect(colors).toHaveLength(5);
    expect(colors[0]).toBe(colord('#ff0000').toHex());
    expect(colors[4]).toBe(colord('#0000ff').toHex());
    expect(colors[2]).toBe(colord('#00ff00').toHex());
  });

  it('clamps n to at least 1', () => {
    expect(sample(['#ff0000', '#0000ff'], 0)).toHaveLength(1);
  });
});

describe('createDivergingInterpolator', () => {
  it('hits low/mid/high at 0/0.5/1', () => {
    const div = createDivergingInterpolator('#2563eb', '#f8fafc', '#dc2626');
    expect(div(0)).toBe(colord('#2563eb').toHex());
    expect(div(0.5)).toBe(colord('#f8fafc').toHex());
    expect(div(1)).toBe(colord('#dc2626').toHex());
  });
});

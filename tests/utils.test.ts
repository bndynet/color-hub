import { describe, it, expect, vi, afterEach } from 'vitest';
import { colord } from 'colord';
import {
  alpha,
  lighten,
  darken,
  saturate,
  desaturate,
  invert,
  grayscale,
  rotateHue,
  mix,
  mixOklab,
  mixOklch,
  colorStepsOklch,
  colorStepsOklab,
  contrastRatio,
  contrastText,
  brightness,
  isValidColor,
  isDark,
  isLight,
  toRgb,
  colorSteps,
  randomColor,
  randomChartColor,
  randomDistinctColor,
  randomPaletteColor,
  createPaletteColorPicker,
  deltaE76,
  minDeltaE76ToExisting,
  distinctColorPerceptual,
} from '../src/utils';

const blue = '#1f77b4';

/** Must match built-in palette order in `src/utils.ts` (tests only; not exported from package). */
const BUILT_IN_CHART_PALETTE = [
  '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE',
  '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#F39C12',
  '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6', '#1ABC9C',
  '#E67E22', '#34495E', '#16A085', '#27AE60', '#2980B9',
] as const;

describe('utils — adjustments', () => {
  it('alpha sets opacity', () => {
    const out = alpha(blue, 0.5);
    expect(colord(out).alpha()).toBeCloseTo(0.5, 2);
  });

  it('lighten increases perceived brightness', () => {
    expect(colord(lighten(blue, 0.2)).brightness()).toBeGreaterThan(
      colord(blue).brightness(),
    );
  });

  it('darken decreases perceived brightness', () => {
    expect(colord(darken(blue, 0.2)).brightness()).toBeLessThan(
      colord(blue).brightness(),
    );
  });

  it('saturate and desaturate move saturation in opposite directions', () => {
    const sat = colord(saturate(blue, 0.3)).toHsl().s;
    const des = colord(desaturate(blue, 0.3)).toHsl().s;
    expect(sat).toBeGreaterThan(colord(blue).toHsl().s);
    expect(des).toBeLessThan(colord(blue).toHsl().s);
  });

  it('invert maps toward the opposite', () => {
    expect(invert('#ffffff').toLowerCase()).toMatch(/^#000000/);
  });

  it('grayscale has near-zero saturation', () => {
    expect(colord(grayscale(blue)).toHsl().s).toBeLessThan(1);
  });

  it('rotateHue shifts hue', () => {
    const before = colord(blue).hue();
    const after = colord(rotateHue(blue, 90)).hue();
    expect(Math.abs(after - before)).toBeCloseTo(90, 0);
  });
});

describe('utils — mix and colorSteps', () => {
  it('mix at 0 returns first color', () => {
    expect(mix('#ff0000', '#0000ff', 0)).toBe(colord('#ff0000').toHex());
  });

  it('mix at 1 returns second color', () => {
    expect(mix('#ff0000', '#0000ff', 1)).toBe(colord('#0000ff').toHex());
  });

  it('mix clamps ratio to [0, 1]', () => {
    expect(mix('#ff0000', '#0000ff', -1)).toBe(mix('#ff0000', '#0000ff', 0));
    expect(mix('#ff0000', '#0000ff', 2)).toBe(mix('#ff0000', '#0000ff', 1));
  });

  it('colorSteps returns inclusive endpoints', () => {
    const steps = colorSteps('#ff0000', '#0000ff', 3);
    expect(steps).toHaveLength(3);
    expect(steps[0]).toBe(mix('#ff0000', '#0000ff', 0));
    expect(steps[2]).toBe(mix('#ff0000', '#0000ff', 1));
  });

  it('colorSteps enforces minimum of 2 steps', () => {
    expect(colorSteps('#000000', '#ffffff', 1)).toHaveLength(2);
  });
});

describe('utils — mixOklab / mixOklch / colorStepsOklch', () => {
  it('mixOklch matches mixOklab', () => {
    expect(mixOklch('#ff0000', '#00ff00', 0.4)).toBe(
      mixOklab('#ff0000', '#00ff00', 0.4),
    );
  });

  it('colorStepsOklab matches colorStepsOklch', () => {
    expect(colorStepsOklab('#aabbcc', '#112233', 5)).toEqual(
      colorStepsOklch('#aabbcc', '#112233', 5),
    );
  });

  it('mixOklab at endpoints matches sRGB hex', () => {
    expect(mixOklab('#ff0000', '#0000ff', 0)).toBe(colord('#ff0000').toHex());
    expect(mixOklab('#ff0000', '#0000ff', 1)).toBe(colord('#0000ff').toHex());
  });

  it('mixOklab midpoint red–blue differs from channel mix (Oklab vs sRGB)', () => {
    const mRgb = mix('#ff0000', '#0000ff', 0.5);
    const mOk = mixOklab('#ff0000', '#0000ff', 0.5);
    expect(mOk).not.toBe(mRgb);
  });

  it('colorStepsOklch aligns with mixOklab endpoints', () => {
    const steps = colorStepsOklch('#ff0000', '#0000ff', 4);
    expect(steps).toHaveLength(4);
    expect(steps[0]).toBe(mixOklab('#ff0000', '#0000ff', 0));
    expect(steps[3]).toBe(mixOklab('#ff0000', '#0000ff', 1));
  });
});

describe('utils — contrast and readability', () => {
  it('contrastRatio is 21 for white vs black', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
  });

  it('contrastRatio is 1 for identical colors', () => {
    expect(contrastRatio('#333333', '#333333')).toBeCloseTo(1, 5);
  });

  it('contrastText picks light text on dark background', () => {
    expect(contrastText('#111111')).toBe('#ffffff');
  });

  it('contrastText picks dark text on light background', () => {
    expect(contrastText('#eeeeee')).toBe('#000000');
  });

  it('contrastText respects custom light/dark', () => {
    expect(
      contrastText('#000000', { light: '#f0f0f0', dark: '#0a0a0a' }),
    ).toBe('#f0f0f0');
  });

  it('brightness is in [0, 1]', () => {
    expect(brightness('#000000')).toBe(0);
    expect(brightness('#ffffff')).toBe(1);
  });

  it('isDark and isLight are mutually exclusive for extremes', () => {
    expect(isDark('#000000')).toBe(true);
    expect(isLight('#000000')).toBe(false);
    expect(isLight('#ffffff')).toBe(true);
    expect(isDark('#ffffff')).toBe(false);
  });
});

describe('utils — parsing', () => {
  it('isValidColor accepts hex', () => {
    expect(isValidColor('#abc')).toBe(true);
    expect(isValidColor('not a color')).toBe(false);
  });

  it('toRgb returns channel objects', () => {
    const { r, g, b, a } = toRgb('#1f77b4');
    expect(r).toBeGreaterThan(0);
    expect(g).toBeGreaterThan(0);
    expect(b).toBeGreaterThan(0);
    expect(a).toBe(1);
  });
});

describe('utils — random', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('randomColor respects mocked random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomColor()).toBe('#000000');
  });

  it('randomChartColor uses mocked hue', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const c = randomChartColor(70, 50);
    expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    expect(colord(c).hue()).toBeCloseTo(180, 0);
  });

  it('randomDistinctColor returns hex', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    expect(randomDistinctColor()).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('randomPaletteColor returns a known palette entry', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const c = randomPaletteColor();
    expect(c).toMatch(/^#[0-9A-F]{6}$/i);
    expect(c).toBe('#2980B9');
  });

  it('randomPaletteColor({ recent }) maximizes minimum ΔE76 to recent set', () => {
    const recent = ['#5470C6'];
    const c = randomPaletteColor({ recent });
    let maxMin = 0;
    for (const p of BUILT_IN_CHART_PALETTE) {
      const m = minDeltaE76ToExisting(p, recent);
      if (m > maxMin) {
        maxMin = m;
      }
    }
    expect(minDeltaE76ToExisting(c, recent)).toBeCloseTo(maxMin, 5);
  });

  it('createPaletteColorPicker: second color is furthest from first in palette', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const pick = createPaletteColorPicker({ memory: 8 });
    const first = pick();
    const second = pick();
    expect(first).toBe('#5470C6');
    let maxMin = 0;
    for (const p of BUILT_IN_CHART_PALETTE) {
      const m = minDeltaE76ToExisting(p, [first]);
      if (m > maxMin) {
        maxMin = m;
      }
    }
    expect(minDeltaE76ToExisting(second, [first])).toBeCloseTo(maxMin, 5);
  });
});


describe('utils — perceptual distance (ΔE76)', () => {
  it('deltaE76 is zero for identical colors', () => {
    expect(deltaE76('#abc', '#aabbcc')).toBeCloseTo(0, 3);
  });

  it('deltaE76 is large between white and black', () => {
    expect(deltaE76('#ffffff', '#000000')).toBeGreaterThan(90);
  });

  it('distinctColorPerceptual stays away from existing (ΔE76)', () => {
    const existing = ['#e74c3c', '#3498db', '#2ecc71'];
    const c = distinctColorPerceptual(existing, { minDeltaE: 18, maxAttempts: 200 });
    expect(c).toMatch(/^#[0-9a-f]{6}$/i);
    expect(minDeltaE76ToExisting(c, existing)).toBeGreaterThanOrEqual(18);
  });
});

/**
 * Perceptual mixing in **Oklab** (rectangular L, a, b): linear interpolation, then sRGB.
 * Matches the spirit of CSS `color-mix(in oklab, …)` and avoids muddy midpoints that often
 * come from **sRGB channel** `mix` or from **Oklch** polar interpolation (C/h lerp can clip
 * badly in sRGB gamut).
 *
 * Conversion math: CSS Color 4 sample (XYZ ↔ OKLab, D65).
 * @see https://drafts.csswg.org/css-color-4/#sample-code-for-oklab-to-srgb
 */
import { colord } from 'colord';

function multiply3x3(m: number[][], v: number[]): number[] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

/** sRGB 0–1 → linear-light sRGB 0–1 (extended transfer function). */
function linSrgb(rgb: number[]): number[] {
  return rgb.map((val) => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    if (abs <= 0.04045) {
      return val / 12.92;
    }
    return sign * ((abs + 0.055) / 1.055) ** 2.4;
  });
}

/** Linear-light sRGB 0–1 → gamma sRGB 0–1. */
function gamSrgb(rgb: number[]): number[] {
  return rgb.map((val) => {
    const sign = val < 0 ? -1 : 1;
    const abs = Math.abs(val);
    if (abs > 0.0031308) {
      return sign * (1.055 * abs ** (1 / 2.4) - 0.055);
    }
    return 12.92 * val;
  });
}

function linSrgbToXyz(rgb: number[]): number[] {
  const M = [
    [506752 / 1228815, 87881 / 245763, 12673 / 70218],
    [87098 / 409605, 175762 / 245763, 12673 / 175545],
    [7918 / 409605, 87881 / 737289, 1001167 / 1053270],
  ];
  return multiply3x3(M, rgb);
}

function xyzToLinSrgb(xyz: number[]): number[] {
  const M = [
    [12831 / 3959, -329 / 214, -1974 / 3959],
    [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
    [705 / 12673, -2585 / 12673, 705 / 667],
  ];
  return multiply3x3(M, xyz);
}

function xyzToOklab(xyz: number[]): number[] {
  const XYZtoLMS = [
    [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
    [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
    [0.0481771893596242, 0.2642395317527308, 0.6335478284694309],
  ];
  const LMStoOKLab = [
    [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
    [1.9779985324311684, -2.4285922420485799, 0.450593709617411],
    [0.0259040424655478, 0.7827717124575296, -0.8086757549230774],
  ];
  const LMS = multiply3x3(XYZtoLMS, xyz);
  const lmsCbrt = LMS.map((c) => Math.cbrt(c));
  return multiply3x3(LMStoOKLab, lmsCbrt);
}

function oklabToXyz(lab: number[]): number[] {
  const LMStoXYZ = [
    [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
    [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
    [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816],
  ];
  const OKLabtoLMS = [
    [1.0, 0.3963377773761749, 0.2158037573099136],
    [1.0, -0.1055613458156586, -0.0638541728258133],
    [1.0, -0.0894841775298119, -1.2914855480194092],
  ];
  const LMSnl = multiply3x3(OKLabtoLMS, lab);
  const LMS = LMSnl.map((c) => c ** 3);
  return multiply3x3(LMStoXYZ, LMS);
}

function srgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const lin = linSrgb([r / 255, g / 255, b / 255]);
  const xyz = linSrgbToXyz(lin);
  const lab = xyzToOklab(xyz);
  return [lab[0], lab[1], lab[2]];
}

function oklabToHex(lab: number[], alpha: number): string {
  const xyz = oklabToXyz(lab);
  const lin = xyzToLinSrgb(xyz).map((c) => Math.max(0, Math.min(1, c)));
  const gam = gamSrgb(lin);
  return colord({
    r: Math.round(gam[0] * 255),
    g: Math.round(gam[1] * 255),
    b: Math.round(gam[2] * 255),
    a: alpha,
  }).toHex();
}

/**
 * Interpolate two colors in **Oklab** (L, a, b linear), then map to sRGB hex.
 * Alpha is interpolated linearly (same as `mix`).
 */
export function mixOklab(color1: string, color2: string, ratio = 0.5): string {
  const t = Math.max(0, Math.min(1, ratio));
  const c1 = colord(color1);
  const c2 = colord(color2);
  if (!c1.isValid() || !c2.isValid()) {
    return colord(color1).toHex();
  }
  const r1 = c1.toRgb();
  const r2 = c2.toRgb();
  const lab1 = srgbToOklab(r1.r, r1.g, r1.b);
  const lab2 = srgbToOklab(r2.r, r2.g, r2.b);
  const lab: [number, number, number] = [
    lab1[0] + (lab2[0] - lab1[0]) * t,
    lab1[1] + (lab2[1] - lab1[1]) * t,
    lab1[2] + (lab2[2] - lab1[2]) * t,
  ];
  const a = r1.a + (r2.a - r1.a) * t;
  return oklabToHex(lab, a);
}

/**
 * Same as {@link mixOklab}. Kept for backward compatibility; interpolation is **not**
 * cylindrical OKLCH (polar C/h), which can yield gray, clipped midpoints toward sRGB.
 */
export const mixOklch = mixOklab;

/** Evenly spaced Oklab mixes from `from` to `to` (inclusive). `steps` ≥ 2. */
export function colorStepsOklch(from: string, to: string, steps: number): string[] {
  const n = Math.max(2, Math.floor(steps));
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(mixOklab(from, to, n === 1 ? 0 : i / (n - 1)));
  }
  return out;
}

/** Alias: same as {@link colorStepsOklch} (Oklab ramps). */
export const colorStepsOklab = colorStepsOklch;

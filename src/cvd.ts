/**
 * Color-vision-deficiency (dichromacy) simulation.
 *
 * Transforms a color into how it is (approximately) perceived by viewers with
 * **protanopia**, **deuteranopia**, or **tritanopia**. This is not an
 * accessibility feature per se — its intended use is **palette robustness
 * checks**: simulate the colors you assigned to chart series, then compare them
 * with {@link deltaE76} / {@link deltaEOK} to detect pairs that collapse (become
 * hard to tell apart) under a given deficiency, and adjust your palette.
 *
 * Model: Machado, Oliveira & Fernandes (2009), severity 1.0, applied in
 * linear-light sRGB. Each matrix has row sums ≈ 1, so achromatic (gray) inputs
 * are preserved. Dependency-free.
 * @see https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
 */
import { colord } from 'colord';

/** Supported dichromacy types. */
export type CvdType = 'protanopia' | 'deuteranopia' | 'tritanopia';

/** Machado et al. (2009) severity-1.0 simulation matrices (linear sRGB). */
const MATRICES: Record<CvdType, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

/** sRGB 0–255 → linear-light sRGB 0–1. */
function linearize(channel: number): number {
  const x = channel / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

/** Linear-light sRGB 0–1 → gamma sRGB 0–255 (clamped, rounded). */
function delinearize(channel: number): number {
  const v =
    channel <= 0.0031308
      ? 12.92 * channel
      : 1.055 * channel ** (1 / 2.4) - 0.055;
  return Math.round(Math.max(0, Math.min(1, v)) * 255);
}

/**
 * Simulate how `color` appears under a given dichromacy `type`.
 * Returns a hex string; invalid input is returned unchanged (normalized to hex).
 *
 * @example
 *   simulate('#ff0000', 'deuteranopia'); // reddish-green shifts toward yellow/olive
 */
export function simulate(color: string, type: CvdType): string {
  const c = colord(color);
  if (!c.isValid()) {
    return colord(color).toHex();
  }
  const { r, g, b, a } = c.toRgb();
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);
  const m = MATRICES[type];
  return colord({
    r: delinearize(m[0][0] * lr + m[0][1] * lg + m[0][2] * lb),
    g: delinearize(m[1][0] * lr + m[1][1] * lg + m[1][2] * lb),
    b: delinearize(m[2][0] * lr + m[2][1] * lg + m[2][2] * lb),
    a,
  }).toHex();
}

/** Simulate `color` under all three dichromacy types at once. */
export function simulateAll(color: string): Record<CvdType, string> {
  return {
    protanopia: simulate(color, 'protanopia'),
    deuteranopia: simulate(color, 'deuteranopia'),
    tritanopia: simulate(color, 'tritanopia'),
  };
}

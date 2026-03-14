import type { ColorHub } from './color-hub';

export enum State {
  DEFAULT = 'default',
  HOVER = 'hover',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export interface StateColors {
  default: string;
  hover: string;
  active: string;
  disabled: string;
  [state: string]: string;
}

export type Colors = Record<State, string>;

/** Light or dark UI semantics; independent of `name` when theme ids are arbitrary. */
export type ColorMode = 'light' | 'dark';

/**
 * How to pick a color after the theme `palette` is exhausted.
 * - `golden` — golden-ratio hue (default, same as before).
 * - `perceptual` — CIELAB ΔE76 against already-assigned colors (better pairwise separation).
 */
export type PaletteExhaustion = 'golden' | 'perceptual';

/**
 * Theme definition. T is the type of colors when provided. Omit T to leave colors untyped.
 */
export type ColorTheme<T = undefined> = {
  name: string;
  /** Light/dark for `StateRecipe` / app logic; optional when you only rely on `name` or tokens. */
  colorMode?: ColorMode;
  /** Named colors (e.g. gridColor, backgroundColor, primaryTextColor), optional. */
  colors?: T;
  /** Palette: colors assigned to keys in order. */
  palette?: string[];
  /** key → color mapping (runtime assignment result). */
  colorMap?: Record<string, string>;
  /** Overrides `ColorHub` options `stateRecipe` for this theme (per-field). */
  stateRecipe?: StateRecipe<T>;
};

/**
 * Optional per-state overrides for hover / active / disabled.
 * Each function receives the base color and the `ColorHub` instance (use `hub.getCurrentTheme()` for the active theme).
 * Omitted states use the built-in defaults (lighten 0.05, darken 0.1, alpha 0.4).
 */
export type StateRecipe<T = undefined> = {
  hover?: (baseColor: string, hub: ColorHub<T>) => string;
  active?: (baseColor: string, hub: ColorHub<T>) => string;
  disabled?: (baseColor: string, hub: ColorHub<T>) => string;
  [state: string]: ((baseColor: string, hub: ColorHub<T>) => string) | undefined;
};

export type ColorHubOptions<T = undefined> = {
  /** Merged with each theme's `stateRecipe`; theme fields override hub fields. */
  stateRecipe?: StateRecipe<T>;
  /** When `palette` runs out: `golden` (default) or `perceptual` (ΔE76 spacing). */
  paletteExhaustion?: PaletteExhaustion;
  /** Minimum ΔE76 vs existing assigned colors for `perceptual` (default ~23). */
  perceptualMinDeltaE?: number;
  /** Max candidate tries for `perceptual` before fallback (default 100). */
  perceptualMaxAttempts?: number;
};

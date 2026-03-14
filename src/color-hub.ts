import {
  ColorHubOptions,
  ColorTheme,
  PaletteExhaustion,
  State,
  StateColors,
  StateRecipe,
} from './types';
import {
  lighten,
  darken,
  alpha,
  randomDistinctColor,
  distinctColorPerceptual,
} from './utils';

export class ColorHub<T = undefined> {
  private static readonly emptyTheme: ColorTheme<never> = {
    name: 'default',
    palette: [],
    colorMap: {},
  };

  private themes: ColorTheme<T>[] = [];
  private currentTheme: ColorTheme<T>;
  private indexUsedInPalette = 0;
  private hubStateRecipe: StateRecipe<T> | undefined;
  private paletteExhaustion: PaletteExhaustion;
  private perceptualMinDeltaE: number;
  private perceptualMaxAttempts: number;

  constructor(
    private defaultThemes: ColorTheme<T>[],
    options?: ColorHubOptions<T>,
  ) {
    this.paletteExhaustion = options?.paletteExhaustion ?? 'golden';
    this.perceptualMinDeltaE = options?.perceptualMinDeltaE ?? 23;
    this.perceptualMaxAttempts = options?.perceptualMaxAttempts ?? 100;
    this.hubStateRecipe = options?.stateRecipe
      ? { ...options.stateRecipe }
      : undefined;
    this.themes = this.defaultThemes.map((theme) => ({
      name: theme.name,
      colorMode: theme.colorMode,
      colors:
        theme.colors !== undefined &&
        typeof theme.colors === 'object' &&
        theme.colors !== null &&
        !Array.isArray(theme.colors)
          ? ({ ...theme.colors } as T)
          : theme.colors,
      palette: [...(theme.palette ?? [])],
      colorMap: { ...(theme.colorMap ?? {}) },
      stateRecipe: theme.stateRecipe ? { ...theme.stateRecipe } : undefined,
    }));
    this.currentTheme = (this.themes[0] ??
      ColorHub.emptyTheme) as ColorTheme<T>;
  }

  switchTheme(themeName: string): void {
    let theme: ColorTheme<T> | undefined;
    for (let i = 0; i < this.themes.length; i++) {
      if (this.themes[i].name === themeName) {
        theme = this.themes[i];
        break;
      }
    }
    this.currentTheme = theme ?? this.themes[0];
    this.indexUsedInPalette = 0;
  }

  /** Active theme object (same reference the hub mutates for `colorMap` / assignments). */
  getCurrentTheme(): ColorTheme<T> {
    return this.currentTheme;
  }

  appendTheme(theme: ColorTheme<T>): void {
    this.themes.push({
      ...theme,
      colors:
        theme.colors !== undefined &&
        typeof theme.colors === 'object' &&
        theme.colors !== null &&
        !Array.isArray(theme.colors)
          ? ({ ...theme.colors } as T)
          : theme.colors,
      palette: [...(theme.palette ?? [])],
      colorMap: { ...(theme.colorMap ?? {}) },
      stateRecipe: theme.stateRecipe ? { ...theme.stateRecipe } : undefined,
    });
  }

  getColors(key: string): StateColors {
    const color = this.getColorByKey(key);
    return this.getStateColors(color);
  }

  appendPalette(name: string, palette: string[]): void {
    this.themes.push({
      name,
      palette,
      colorMap: {},
      stateRecipe: undefined,
    });
  }

  private getColorByKey(key: string): string {
    const colorMap = this.currentTheme.colorMap ?? {};
    const palette = this.currentTheme.palette ?? [];

    if (colorMap[key]) {
      return colorMap[key];
    }

    const usedColors = Object.values(colorMap);
    let color: string | undefined;

    // Find an unused color from the palette
    while (this.indexUsedInPalette < palette.length) {
      const candidateColor = palette[this.indexUsedInPalette++];
      if (!usedColors.includes(candidateColor)) {
        color = candidateColor;
        break;
      }
    }

    // If palette is exhausted, generate a new color
    if (!color) {
      if (this.paletteExhaustion === 'perceptual') {
        do {
          color = distinctColorPerceptual(usedColors, {
            minDeltaE: this.perceptualMinDeltaE,
            maxAttempts: this.perceptualMaxAttempts,
          });
        } while (usedColors.includes(color));
      } else {
        do {
          color = randomDistinctColor();
        } while (usedColors.includes(color));
      }
    }

    if (!this.currentTheme.colorMap) {
      this.currentTheme.colorMap = {};
    }
    this.currentTheme.colorMap[key] = color;

    return color;
  }

  private getMergedStateRecipe(): StateRecipe<T> {
    const themeRecipe = this.currentTheme.stateRecipe;
    const hubRecipe = this.hubStateRecipe;
    const merged: StateRecipe<T> = {};
    if (hubRecipe) {
      for (const key of Object.keys(hubRecipe)) {
        if (hubRecipe[key] !== undefined) {
          merged[key] = hubRecipe[key];
        }
      }
    }
    if (themeRecipe) {
      for (const key of Object.keys(themeRecipe)) {
        if (themeRecipe[key] !== undefined) {
          merged[key] = themeRecipe[key];
        }
      }
    }
    return merged;
  }

  private getStateColors(color: string): StateColors {
    const r = this.getMergedStateRecipe();
    const result: StateColors = {
      [State.DEFAULT]: color,
      [State.HOVER]: r.hover ? r.hover(color, this) : lighten(color, 0.05),
      [State.ACTIVE]: r.active ? r.active(color, this) : darken(color, 0.1),
      [State.DISABLED]: r.disabled
        ? r.disabled(color, this)
        : alpha(color, 0.4),
    };
    for (const key of Object.keys(r)) {
      if (
        key !== State.HOVER &&
        key !== State.ACTIVE &&
        key !== State.DISABLED &&
        r[key]
      ) {
        result[key] = r[key]!(color, this);
      }
    }
    return result;
  }
}

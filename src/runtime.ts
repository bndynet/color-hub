/**
 * Browser runtime helpers: apply a theme to the DOM as CSS variables, read/watch the
 * system color scheme, and persist the chosen theme name. All functions feature-detect
 * their globals so importing this module is safe in Node / SSR (they become no-ops).
 */
import type { ColorMode, ColorTheme } from './types';
import type { ColorHub } from './color-hub';
import { toCSSVariables, type ToCSSVariablesOptions } from './css';

const DEFAULT_STORAGE_KEY = 'color-hub-theme';

export type ApplyThemeOptions = ToCSSVariablesOptions & {
  /** Element to write variables on. Default `document.documentElement`. */
  target?: HTMLElement;
  /**
   * Attribute set to the theme `name` (e.g. for `[data-theme="..."]` selectors).
   * Pass `null` to skip. Default `'data-theme'`.
   */
  attribute?: string | null;
};

/** Apply a theme's colors as CSS custom properties on an element. */
export function applyTheme<T>(theme: ColorTheme<T>, options?: ApplyThemeOptions): void {
  const target =
    options?.target ??
    (typeof document !== 'undefined' ? document.documentElement : undefined);
  if (!target) {
    return;
  }
  const vars = toCSSVariables(theme, options);
  for (const [name, value] of Object.entries(vars)) {
    target.style.setProperty(name, value);
  }
  const attribute =
    options?.attribute === undefined ? 'data-theme' : options.attribute;
  if (attribute) {
    target.setAttribute(attribute, theme.name);
  }
}

/** Current OS/browser color scheme; `'light'` when unknown (Node/SSR). */
export function getSystemColorScheme(): ColorMode {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

/** Subscribe to OS color-scheme changes. Returns an unsubscribe function (no-op in Node). */
export function watchSystemColorScheme(
  callback: (mode: ColorMode) => void,
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (event: MediaQueryListEvent) => {
    callback(event.matches ? 'dark' : 'light');
  };
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}

/** Persist the active theme name (e.g. to restore on next load). Safe no-op without storage. */
export function persistThemeName(
  name: string,
  storageKey: string = DEFAULT_STORAGE_KEY,
): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, name);
    }
  } catch {
    /* ignore: storage unavailable / quota exceeded / private mode */
  }
}

/** Load a previously persisted theme name, or `null`. */
export function loadThemeName(
  storageKey: string = DEFAULT_STORAGE_KEY,
): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(storageKey);
    }
  } catch {
    /* ignore: storage unavailable */
  }
  return null;
}

export type BindThemeOptions = ApplyThemeOptions & {
  /** Persist the theme name on each change. `true` uses the default key, a string sets the key. */
  persist?: boolean | string;
};

/**
 * Apply the hub's current theme to the DOM now, and re-apply on every theme switch.
 * Returns an unsubscribe function.
 */
export function bindThemeToDOM<T>(
  hub: ColorHub<T>,
  options?: BindThemeOptions,
): () => void {
  const apply = (theme: ColorTheme<T>) => {
    applyTheme(theme, options);
    if (options?.persist) {
      persistThemeName(
        theme.name,
        typeof options.persist === 'string' ? options.persist : undefined,
      );
    }
  };
  apply(hub.getCurrentTheme());
  return hub.onThemeChange(apply);
}

/**
 * Emit CSS custom properties from a {@link ColorTheme}, so a theme can be applied
 * to the DOM (`:root { --ch-...: ... }`) or fed into CSS-in-JS / design tokens.
 */
import type { ColorTheme } from './types';

export type ToCSSVariablesOptions = {
  /** Variable prefix, e.g. `ch` → `--ch-grid`. Default `ch`. */
  prefix?: string;
  /** Also emit `--<prefix>-palette-<i>` for each palette entry. Default `false`. */
  includePalette?: boolean;
  /** Also emit one variable per `colorMap` key (sanitized). Default `false`. */
  includeColorMap?: boolean;
};

export type ToCSSStringOptions = ToCSSVariablesOptions & {
  /** CSS selector wrapping the declarations. Default `:root`. */
  selector?: string;
};

/** `textPrimary` / `"Series A"` → `text-primary` / `series-a` (CSS-var safe). */
function toVarSegment(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Build a `{ '--ch-grid': '#...' }` map from a theme's `colors` (and optionally
 * `palette` / `colorMap`). camelCase keys become kebab-case; arbitrary keys are
 * sanitized to valid custom-property names.
 */
export function toCSSVariables<T>(
  theme: ColorTheme<T>,
  options?: ToCSSVariablesOptions,
): Record<string, string> {
  const prefix = options?.prefix ?? 'ch';
  const vars: Record<string, string> = {};

  if (isStringRecord(theme.colors)) {
    for (const [key, value] of Object.entries(theme.colors)) {
      if (typeof value === 'string') {
        vars[`--${prefix}-${toVarSegment(key)}`] = value;
      }
    }
  }

  if (options?.includePalette && Array.isArray(theme.palette)) {
    theme.palette.forEach((color, index) => {
      vars[`--${prefix}-palette-${index}`] = color;
    });
  }

  if (options?.includeColorMap && theme.colorMap) {
    for (const [key, value] of Object.entries(theme.colorMap)) {
      vars[`--${prefix}-${toVarSegment(key)}`] = value;
    }
  }

  return vars;
}

/**
 * Render a theme as a ready-to-inject CSS rule, e.g.
 * `:root {\n  --ch-grid: #e2e8f0;\n}`.
 */
export function toCSSString<T>(
  theme: ColorTheme<T>,
  options?: ToCSSStringOptions,
): string {
  const selector = options?.selector ?? ':root';
  const vars = toCSSVariables(theme, options);
  const body = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n');
  return `${selector} {\n${body}\n}`;
}

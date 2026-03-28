import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  applyTheme,
  getSystemColorScheme,
  watchSystemColorScheme,
  persistThemeName,
  loadThemeName,
  bindThemeToDOM,
} from '../src/runtime';
import { ColorHub } from '../src/color-hub';
import type { ColorTheme } from '../src/types';

type FakeEl = {
  style: { setProperty: ReturnType<typeof vi.fn> };
  setAttribute: ReturnType<typeof vi.fn>;
};

function fakeElement(): FakeEl {
  return {
    style: { setProperty: vi.fn() },
    setAttribute: vi.fn(),
  };
}

const theme: ColorTheme<{ background: string; textPrimary: string }> = {
  name: 'demo-dark',
  colorMode: 'dark',
  colors: { background: '#020617', textPrimary: '#e2e8f0' },
  palette: ['#60a5fa'],
  colorMap: {},
};

afterEach(() => {
  vi.restoreAllMocks();
  delete (globalThis as Record<string, unknown>).localStorage;
});

describe('applyTheme', () => {
  it('writes CSS variables and the data-theme attribute to the target', () => {
    const el = fakeElement();
    applyTheme(theme, { target: el as unknown as HTMLElement });
    expect(el.style.setProperty).toHaveBeenCalledWith('--ch-background', '#020617');
    expect(el.style.setProperty).toHaveBeenCalledWith(
      '--ch-text-primary',
      '#e2e8f0',
    );
    expect(el.setAttribute).toHaveBeenCalledWith('data-theme', 'demo-dark');
  });

  it('respects a custom prefix and skips the attribute when null', () => {
    const el = fakeElement();
    applyTheme(theme, {
      target: el as unknown as HTMLElement,
      prefix: 'app',
      attribute: null,
    });
    expect(el.style.setProperty).toHaveBeenCalledWith('--app-background', '#020617');
    expect(el.setAttribute).not.toHaveBeenCalled();
  });

  it('is a no-op when no target and no document', () => {
    expect(() => applyTheme(theme)).not.toThrow();
  });
});

describe('getSystemColorScheme', () => {
  it("defaults to 'light' without matchMedia", () => {
    expect(getSystemColorScheme()).toBe('light');
  });
});

describe('watchSystemColorScheme', () => {
  it('returns a no-op unsubscribe without matchMedia', () => {
    const unsub = watchSystemColorScheme(() => {});
    expect(() => unsub()).not.toThrow();
  });
});

describe('persist / load theme name', () => {
  it('round-trips through a localStorage stub', () => {
    const store = new Map<string, string>();
    (globalThis as Record<string, unknown>).localStorage = {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    persistThemeName('demo-dark');
    expect(loadThemeName()).toBe('demo-dark');
    persistThemeName('brand', 'my-key');
    expect(loadThemeName('my-key')).toBe('brand');
  });

  it('loadThemeName returns null without storage', () => {
    expect(loadThemeName()).toBeNull();
  });
});

describe('bindThemeToDOM', () => {
  it('applies the current theme and re-applies on switch', () => {
    const el = fakeElement();
    const hub = new ColorHub([
      { name: 'light', colorMode: 'light', palette: ['#2563eb'], colorMap: {} },
      { name: 'dark', colorMode: 'dark', palette: ['#60a5fa'], colorMap: {} },
    ]);
    const unbind = bindThemeToDOM(hub, { target: el as unknown as HTMLElement });
    expect(el.setAttribute).toHaveBeenLastCalledWith('data-theme', 'light');

    hub.switchTheme('dark');
    expect(el.setAttribute).toHaveBeenLastCalledWith('data-theme', 'dark');

    unbind();
    hub.switchTheme('light');
    expect(el.setAttribute).toHaveBeenLastCalledWith('data-theme', 'dark');
  });
});

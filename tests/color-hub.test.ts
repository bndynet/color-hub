import { describe, it, expect, beforeEach } from 'vitest';
import { ColorHub } from '../src/color-hub';
import type { ColorTheme } from '../src/types';
import { colord } from 'colord';
import { lighten } from '../src/utils';

interface SiteColors {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  text: string;
}

/** Test-only access to private ColorHub fields. */
function internals<T>(hub: ColorHub<T>) {
  return hub as unknown as {
    themes: ColorTheme<T>[];
    currentTheme: ColorTheme<T>;
    indexUsedInPalette: number;
  };
}

describe('ColorHub', () => {
  let hub: ColorHub<SiteColors>;
  let mockThemes: ColorTheme<SiteColors>[];

  beforeEach(() => {
    mockThemes = [
      {
        name: 'light',
        palette: ['#FF0000', '#00FF00', '#0000FF'],
        colorMap: {},
      },
      {
        name: 'dark',
        palette: ['#AA0000', '#00AA00', '#0000AA'],
        colorMap: {},
      },
    ];
    hub = new ColorHub(mockThemes);
  });

  describe('constructor', () => {
    it('stores the provided themes', () => {
      expect(internals(hub).themes).toHaveLength(2);
    });

    it('deep-clones palette and colorMap so external mutations do not leak', () => {
      const original = mockThemes[0];
      original.palette ??= [];
      original.colorMap ??= {};
      original.palette.push('#FFFFFF');
      original.colorMap['test'] = '#000000';

      expect(internals(hub).themes[0].palette).not.toContain('#FFFFFF');
      expect(internals(hub).themes[0].colorMap).not.toHaveProperty('test');
    });
  });

  describe('switchTheme', () => {
    it('selects the named theme for new color assignments', () => {
      hub.switchTheme('light');
      hub.getColors('a');
      hub.switchTheme('dark');
      expect(hub.getColors('b').default).toBe('#AA0000');
    });

    it('falls back to the first theme when the name is unknown', () => {
      hub.switchTheme('missing');
      expect(hub.getColors('x').default).toBe('#FF0000');
    });

    it('resets the palette cursor when switching', () => {
      hub.switchTheme('light');
      hub.getColors('k1');
      hub.getColors('k2');
      hub.switchTheme('dark');
      hub.getColors('kA');
      hub.switchTheme('light');
      expect(hub.getColors('k3').default).toBe('#0000FF');
    });

    it('getCurrentTheme matches the active theme', () => {
      hub.switchTheme('light');
      expect(hub.getCurrentTheme().name).toBe('light');
      hub.switchTheme('dark');
      expect(hub.getCurrentTheme().name).toBe('dark');
    });

    it('preserves optional colorMode when switching', () => {
      const h = new ColorHub([
        { name: 'a', colorMode: 'light', palette: ['#ffffff'], colorMap: {} },
        { name: 'b', colorMode: 'dark', palette: ['#000000'], colorMap: {} },
      ]);
      h.switchTheme('a');
      expect(h.getCurrentTheme().colorMode).toBe('light');
      h.switchTheme('b');
      expect(h.getCurrentTheme().colorMode).toBe('dark');
    });
  });

  describe('appendTheme', () => {
    it('adds a theme and allows switching to it', () => {
      hub.appendTheme({
        name: 'custom',
        palette: ['#ABCDEF'],
        colorMap: {},
      });
      expect(internals(hub).themes).toHaveLength(3);
      hub.switchTheme('custom');
      expect(hub.getColors('any').default).toBe('#ABCDEF');
    });
  });

  describe('appendPalette', () => {
    it('appends a theme with only name and palette', () => {
      hub.appendPalette('extra', ['#111111', '#222222']);
      expect(internals(hub).themes).toHaveLength(3);
      const t = internals(hub).themes[2];
      expect(t.name).toBe('extra');
      expect(t.palette).toEqual(['#111111', '#222222']);
      expect(t.colorMap).toEqual({});
    });
  });

  describe('getColors', () => {
    beforeEach(() => {
      hub.switchTheme('light');
    });

    it('returns default, hover, active, and disabled', () => {
      const c = hub.getColors('key1');
      expect(c).toEqual(
        expect.objectContaining({
          default: expect.any(String),
          hover: expect.any(String),
          active: expect.any(String),
          disabled: expect.any(String),
        }),
      );
    });

    it('is stable for the same key', () => {
      expect(hub.getColors('same').default).toBe(hub.getColors('same').default);
    });

    it('consumes the palette in order', () => {
      expect(hub.getColors('a').default).toBe('#FF0000');
      expect(hub.getColors('b').default).toBe('#00FF00');
      expect(hub.getColors('c').default).toBe('#0000FF');
    });

    it('skips palette entries already present in colorMap', () => {
      const theme = internals(hub).currentTheme;
      theme.colorMap ??= {};
      theme.colorMap['existing'] = '#00FF00';
      expect(hub.getColors('k1').default).toBe('#FF0000');
      expect(hub.getColors('k2').default).toBe('#0000FF');
    });

    it('generates a hex color when the palette is exhausted', () => {
      hub.getColors('k1');
      hub.getColors('k2');
      hub.getColors('k3');
      const fourth = hub.getColors('k4').default;
      expect(fourth).toMatch(/^#[0-9A-F]{6}$/i);
      expect(['#FF0000', '#00FF00', '#0000FF']).not.toContain(fourth);
    });

    it('uses perceptual exhaustion when paletteExhaustion is perceptual', () => {
      const h = new ColorHub(
        [{ name: 't', palette: [], colorMap: {} }],
        {
          paletteExhaustion: 'perceptual',
          perceptualMinDeltaE: 15,
          perceptualMaxAttempts: 150,
        },
      );
      h.switchTheme('t');
      const a = h.getColors('a').default;
      const b = h.getColors('b').default;
      expect(a).toMatch(/^#[0-9A-F]{6}$/i);
      expect(b).toMatch(/^#[0-9A-F]{6}$/i);
      expect(a).not.toBe(b);
    });

    it('assigns different keys different colors after exhaustion', () => {
      hub.getColors('k1');
      hub.getColors('k2');
      hub.getColors('k3');
      const a = hub.getColors('k4').default;
      const b = hub.getColors('k5').default;
      const c = hub.getColors('k6').default;
      expect(new Set([a, b, c]).size).toBe(3);
    });
  });

  describe('hash assignment', () => {
    const palette = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

    it('maps a key to the same color regardless of request order', () => {
      const a = new ColorHub([{ name: 't', palette, colorMap: {} }], {
        assignment: 'hash',
      });
      const b = new ColorHub([{ name: 't', palette, colorMap: {} }], {
        assignment: 'hash',
      });
      a.switchTheme('t');
      b.switchTheme('t');

      // Request in different orders.
      a.getColors('Sales');
      a.getColors('Profit');
      b.getColors('Profit');
      b.getColors('Sales');

      expect(a.getColors('Sales').default).toBe(b.getColors('Sales').default);
      expect(a.getColors('Profit').default).toBe(b.getColors('Profit').default);
    });

    it('always picks a color from the palette', () => {
      const hub = new ColorHub([{ name: 't', palette, colorMap: {} }], {
        assignment: 'hash',
      });
      hub.switchTheme('t');
      for (const key of ['a', 'b', 'c', 'longer-series-name', 'x']) {
        expect(palette).toContain(hub.getColors(key).default);
      }
    });

    it('still honors a pre-filled colorMap', () => {
      const hub = new ColorHub(
        [{ name: 't', palette, colorMap: { pinned: '#123456' } }],
        { assignment: 'hash' },
      );
      hub.switchTheme('t');
      expect(hub.getColors('pinned').default).toBe('#123456');
    });

    it('falls back to generation when palette is empty', () => {
      const hub = new ColorHub([{ name: 't', palette: [], colorMap: {} }], {
        assignment: 'hash',
      });
      hub.switchTheme('t');
      expect(hub.getColors('only').default).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('defaults to sequential assignment', () => {
      const hub = new ColorHub([{ name: 't', palette, colorMap: {} }]);
      hub.switchTheme('t');
      expect(hub.getColors('first').default).toBe('#FF0000');
      expect(hub.getColors('second').default).toBe('#00FF00');
    });
  });

  describe('state derivation', () => {
    beforeEach(() => {
      hub.switchTheme('light');
    });

    it('uses the base color as default', () => {
      expect(hub.getColors('k1').default).toBe('#FF0000');
    });

    it('makes hover brighter than default', () => {
      const colors = hub.getColors('k1');
      expect(colord(colors.hover).brightness()).toBeGreaterThan(
        colord(colors.default).brightness(),
      );
    });

    it('makes active darker than default', () => {
      const colors = hub.getColors('k1');
      expect(colord(colors.active).brightness()).toBeLessThan(
        colord(colors.default).brightness(),
      );
    });

    it('sets disabled alpha to 0.4', () => {
      expect(colord(hub.getColors('k1').disabled).alpha()).toBeCloseTo(0.4, 1);
    });

    it('exposes focus and selected states', () => {
      const c = hub.getColors('k1');
      expect(c.focus).toMatch(/^#[0-9a-f]{6,8}$/i);
      expect(c.selected).toMatch(/^#[0-9a-f]{6,8}$/i);
      expect(colord(c.focus).alpha()).toBeCloseTo(0.5, 1);
    });
  });

  describe('colorMode-aware state defaults', () => {
    it('lightens selected in light mode and darkens it in dark mode', () => {
      const base = '#3366cc';
      const lightHub = new ColorHub([
        { name: 'l', colorMode: 'light', palette: [base], colorMap: {} },
      ]);
      const darkHub = new ColorHub([
        { name: 'd', colorMode: 'dark', palette: [base], colorMap: {} },
      ]);
      lightHub.switchTheme('l');
      darkHub.switchTheme('d');
      expect(colord(lightHub.getColors('x').selected).brightness()).toBeGreaterThan(
        colord(base).brightness(),
      );
      expect(colord(darkHub.getColors('x').selected).brightness()).toBeLessThan(
        colord(base).brightness(),
      );
    });
  });

  describe('onThemeChange', () => {
    it('notifies subscribers on switch and supports unsubscribe', () => {
      const seen: string[] = [];
      const unsub = hub.onThemeChange((t) => seen.push(t.name));
      hub.switchTheme('light');
      hub.switchTheme('dark');
      unsub();
      hub.switchTheme('light');
      expect(seen).toEqual(['light', 'dark']);
    });
  });


  describe('stateRecipe', () => {
    it('applies hub-level hover override', () => {
      const h = new ColorHub(mockThemes, {
        stateRecipe: {
          hover: (base, _hub) => lighten(base, 0.2),
        },
      });
      h.switchTheme('light');
      const custom = h.getColors('k1');
      const defaultHub = new ColorHub(mockThemes);
      defaultHub.switchTheme('light');
      const builtin = defaultHub.getColors('k1');
      expect(colord(custom.hover).brightness()).toBeGreaterThan(
        colord(builtin.hover).brightness(),
      );
    });

    it('uses custom function output for hover', () => {
      const h = new ColorHub(mockThemes, {
        stateRecipe: {
          hover: (_base, _hub) => '#00ff00',
        },
      });
      h.switchTheme('light');
      expect(h.getColors('k1').hover.toLowerCase()).toBe('#00ff00');
    });

    it('merges theme stateRecipe over hub per field', () => {
      const h = new ColorHub(
        [
          {
            name: 'light',
            palette: ['#FF0000'],
            colorMap: {},
            stateRecipe: {
              hover: (_base, hub) =>
                hub.getCurrentTheme().name === 'light' ? '#abcdef' : '#bad',
            },
          },
          {
            name: 'dark',
            palette: ['#00FF00'],
            colorMap: {},
          },
        ],
        {
          stateRecipe: {
            hover: () => '#111111',
            active: () => '#222222',
          },
        },
      );
      h.switchTheme('light');
      expect(h.getColors('a').hover.toLowerCase()).toBe('#abcdef');
      expect(h.getColors('a').active.toLowerCase()).toBe('#222222');
      h.switchTheme('dark');
      expect(h.getColors('b').hover.toLowerCase()).toBe('#111111');
      expect(h.getColors('b').active.toLowerCase()).toBe('#222222');
    });
  });

  describe('edge cases', () => {
    it('works with an empty palette', () => {
      hub.appendTheme({ name: 'empty', palette: [], colorMap: {} });
      hub.switchTheme('empty');
      expect(hub.getColors('only').default).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('works with a single-slot palette: second key gets generated', () => {
      hub.appendTheme({ name: 'one', palette: ['#AABBCC'], colorMap: {} });
      hub.switchTheme('one');
      expect(hub.getColors('first').default).toBe('#AABBCC');
      expect(hub.getColors('second').default).toMatch(/^#[0-9A-F]{6}$/i);
      expect(hub.getColors('second').default).not.toBe('#AABBCC');
    });

    it('honors pre-filled colorMap before palette', () => {
      hub.appendTheme({
        name: 'prefilled',
        palette: ['#FF0000', '#00FF00'],
        colorMap: { existing: '#CCCCCC' },
      });
      hub.switchTheme('prefilled');
      expect(hub.getColors('existing').default).toBe('#CCCCCC');
      expect(hub.getColors('new').default).toBe('#FF0000');
    });

    it('assigns a unique color per key when many keys exceed the palette', () => {
      hub.switchTheme('light');
      const keys = Array.from({ length: 100 }, (_, i) => `series-${i}`);
      const colors = keys.map((k) => hub.getColors(k).default);
      colors.forEach((c) => {
        expect(c).toMatch(/^#[0-9A-F]{6}$/i);
      });
      expect(new Set(colors).size).toBe(100);
    });
  });

  describe('integration', () => {
    it('supports theme switch and appendPalette in one flow', () => {
      const h = new ColorHub([
        {
          name: 'main',
          palette: ['#E74C3C', '#3498DB', '#2ECC71'],
          colorMap: {},
        },
      ]);
      h.switchTheme('main');
      expect(h.getColors('primary-button').default).toBe('#E74C3C');
      expect(h.getColors('primary-button').default).toBe(
        h.getColors('primary-button').default,
      );
      h.appendPalette('dark', ['#1A1A1A', '#2A2A2A']);
      h.switchTheme('dark');
      expect(h.getColors('other').default).toBe('#1A1A1A');
    });
  });
});

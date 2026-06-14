const e=`# More Recipes

A grab‑bag of common, copy‑pasteable patterns. The interactive pages cover charts
and heatmaps; here are more end‑to‑end snippets.

## Generate a design‑token palette from one brand color

\`\`\`ts
import { generateScale, toCSSString } from '@bndynet/color-hub';

const primary = generateScale('#2563eb'); // 50–950
const css = toCSSString(
  { name: 'tokens', colors: {
      primary50: primary[50], primary500: primary[500], primary900: primary[900],
  } },
  { selector: ':root' },
);
// :root { --ch-primary50: ...; --ch-primary500: ...; --ch-primary900: ...; }
\`\`\`

## Light/dark theming wired to the OS

\`\`\`ts
import {
  ColorHub,
  createThemeFromColor,
  bindThemeToDOM,
  getSystemColorScheme,
  watchSystemColorScheme,
} from '@bndynet/color-hub';

const { light, dark } = createThemeFromColor('#2563eb', { name: 'brand' });
const hub = new ColorHub([light, dark]);

// Apply current theme as CSS vars + re-apply on every switch; persist the choice.
const unbind = bindThemeToDOM(hub, { persist: true });

// Follow the OS preference.
hub.switchTheme(getSystemColorScheme() === 'dark' ? 'brand-dark' : 'brand-light');
watchSystemColorScheme((mode) =>
  hub.switchTheme(mode === 'dark' ? 'brand-dark' : 'brand-light'),
);
\`\`\`

## Guarantee readable text on dynamic backgrounds

\`\`\`ts
import { contrastText, ensureContrast } from '@bndynet/color-hub';

// Tag/badge whose background comes from data:
badge.style.background = tagColor;
badge.style.color = contrastText(tagColor); // black or white, whichever reads

// Force a brand link color to pass AA on a given surface:
const linkColor = ensureContrast('#7aa2ff', surface, { level: 'AA' });
\`\`\`

## Status colors with consistent states

\`\`\`ts
import { ColorHub } from '@bndynet/color-hub';

const hub = new ColorHub([
  {
    name: 'light',
    colorMode: 'light',
    palette: [],
    colorMap: { success: '#16a34a', warning: '#d97706', danger: '#dc2626' },
  },
]);

const danger = hub.getColors('danger');
button.style.background = danger.default;
button.style.setProperty('--hover', danger.hover);
button.disabled && (button.style.background = danger.disabled);
\`\`\`

## Build a colorblind‑robust categorical palette

\`\`\`ts
import { distinctColorPerceptual, simulate, deltaEOK } from '@bndynet/color-hub';

const palette: string[] = [];
while (palette.length < 8) {
  const c = distinctColorPerceptual(palette, { metric: 'deOK' });
  // Reject if it collapses with an existing color for deuteranopes.
  const safe = palette.every(
    (p) => deltaEOK(simulate(p, 'deuteranopia'), simulate(c, 'deuteranopia')) > 0.08,
  );
  if (safe) palette.push(c);
}
\`\`\`

## Continuous value → color (gauges, maps)

\`\`\`ts
import { createInterpolator } from '@bndynet/color-hub';

const scale = createInterpolator(['#16a34a', '#facc15', '#dc2626']); // good → bad
const colorFor = (ratio: number) => scale(ratio); // ratio in [0, 1]
\`\`\`

## See also

- **ColorHub → Key → Color** — stable series colors
- **Scenarios → Chart Series Colors / Data Heatmaps** — full interactive examples
- **Utilities** — every helper with a live demo
- [API reference (README)](https://github.com/bndynet/color-hub#readme)
`;export{e as default};

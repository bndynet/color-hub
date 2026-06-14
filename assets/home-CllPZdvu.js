const e=`# @bndynet/color-hub

> A small, TypeScript‑first color toolkit built on [colord](https://github.com/omgovich/colord). Multi‑theme palettes, key → color assignment for charts and UI, and \`default / hover / active / disabled\` state colors — plus a full set of perceptual color utilities.

## Why color-hub?

- **Charts & dashboards** — assign a stable, distinguishable color to every data series by name.
- **Design systems** — generate tonal scales (\`50\`–\`950\`), light/dark theme pairs, and CSS variables.
- **Accessibility** — WCAG contrast checks, automatic readable text, and color‑blindness simulation.
- **Perceptual quality** — Oklab mixing, OKLCH output, and ΔE distance metrics, all dependency‑free.
- **Tiny & tree‑shakeable** — import the whole barrel or a single feature subpath.

## Install

\`\`\`bash
npm install @bndynet/color-hub
\`\`\`

\`\`\`ts
import { ColorHub, generateScale, ensureContrast } from '@bndynet/color-hub';
\`\`\`

## Explore the demos

Everything in the sidebar is **interactive** — pick colors and watch the helpers respond live.

| Section | What you'll find |
|---------|------------------|
| **Utilities** | Live demos for every helper: adjustments, mixing, scales, harmony, interpolation, contrast, distance, CVD, conversion. |
| **ColorHub** | The \`ColorHub\` class: key → color assignment, state colors, and theming. |
| **Scenarios** | End‑to‑end recipes: chart series colors, heatmaps, design tokens. |

> Tip: use the theme switcher in the top bar — these pages are styled with the active theme, and several demos react to light/dark mode.
`;export{e as default};

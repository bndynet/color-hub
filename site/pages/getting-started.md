# Getting Started

## Requirements

- Node.js **≥ 18**

## Installation

```bash
npm install @bndynet/color-hub
```

## Import styles

### ESM (recommended)

```ts
import { ColorHub, State, lighten, generateScale } from '@bndynet/color-hub';
```

### CommonJS

```js
const { ColorHub, lighten } = require('@bndynet/color-hub');
```

### Deep imports (best tree‑shaking)

Each feature ships as its own subpath export, so bundlers can drop everything you
don't use:

```ts
import { harmony } from '@bndynet/color-hub/harmony';
import { createInterpolator } from '@bndynet/color-hub/interpolate';
import { simulate } from '@bndynet/color-hub/cvd';
```

Available subpaths: `./utils`, `./scale`, `./harmony`, `./css`, `./theme-factory`,
`./runtime`, `./cvd`, `./interpolate`, `./color-hub` (plus the `.` barrel and
`./global` IIFE).

### Browser (IIFE global)

The build emits `dist/index.global.js`, exposing a global `ch`:

```html
<script src="./node_modules/@bndynet/color-hub/dist/index.global.js"></script>
<script>
  const hub = new ch.ColorHub([
    { name: 'light', palette: ['#2563eb', '#14b8a6'], colorMap: {} },
  ]);
</script>
```

## First steps

### 1. Transform a color

```ts
import { lighten, darken, mixOklab } from '@bndynet/color-hub';

lighten('#2563eb', 0.1);          // brighter blue
darken('#2563eb', 0.1);           // deeper blue
mixOklab('#2563eb', '#f97316');   // perceptual blend
```

### 2. Assign colors to keys (great for charts)

```ts
import { ColorHub } from '@bndynet/color-hub';

const hub = new ColorHub([
  { name: 'light', palette: ['#2563eb', '#14b8a6', '#f97316'], colorMap: {} },
]);

hub.getColors('Sales').default;   // first palette color
hub.getColors('Profit').default;  // second palette color
```

### 3. Build accessible UI states

```ts
const sales = hub.getColors('Sales');
sales.default;   // base
sales.hover;     // lighter / darker (colorMode-aware)
sales.active;
sales.disabled;  // alpha 0.4
```

Continue with the **Utilities** and **ColorHub** sections in the sidebar — each
page has a runnable, interactive demo.

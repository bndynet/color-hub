<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  createThemeFromColor,
  toCSSString,
  type ColorTheme,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import RangeField from '../components/RangeField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const brand = ref('#2563eb');
const paletteSize = ref(8);

const pair = computed(() =>
  createThemeFromColor(brand.value, {
    name: 'brand',
    paletteSize: paletteSize.value,
  }),
);

// A theme with named colors to show CSS-variable emission.
const tokenTheme = computed<ColorTheme>(() => ({
  name: 'brand-dark',
  colorMode: 'dark',
  colors: { background: '#020617', surface: '#0f172a', textPrimary: '#e2e8f0' },
  palette: pair.value.dark.palette,
}));

const css = computed(() =>
  toCSSString(tokenTheme.value, {
    selector: '[data-theme="brand-dark"]',
    includePalette: true,
  }),
);
</script>

<template>
  <h1>Themes &amp; CSS Variables</h1>
  <p class="lead">
    Build a light/dark theme pair from a single brand color, then emit the result
    as CSS custom properties for your app or design tokens.
  </p>

  <DemoCard
    title="createThemeFromColor(base)"
    desc="The base anchors palette[0] of the light theme; the rest spread by the golden angle. The dark theme lifts colors for dark backgrounds."
  >
    <div class="controls">
      <ColorField v-model="brand" label="Brand color" />
      <RangeField v-model="paletteSize" label="paletteSize" :min="2" :max="12" :step="1" />
    </div>

    <p class="result-line"><strong>{{ pair.light.name }}</strong> (light)</p>
    <div class="swatches" style="margin-bottom: 0.9rem">
      <Swatch
        v-for="(c, i) in pair.light.palette"
        :key="'l' + i"
        :color="c"
        :height="48"
        :show-value="false"
      />
    </div>

    <p class="result-line"><strong>{{ pair.dark.name }}</strong> (dark)</p>
    <div class="swatches">
      <Swatch
        v-for="(c, i) in pair.dark.palette"
        :key="'d' + i"
        :color="c"
        :height="48"
        :show-value="false"
      />
    </div>
  </DemoCard>

  <DemoCard
    title="toCSSString(theme)"
    desc="Emit named colors (camelCase → kebab-case) plus the palette as an injectable CSS rule."
  >
    <pre><code>{{ css }}</code></pre>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { ColorHub, createThemeFromColor, toCSSString, applyTheme } from '@bndynet/color-hub';

const { light, dark } = createThemeFromColor('#2563eb', { name: 'brand' });
const hub = new ColorHub([light, dark]); // 'brand-light' / 'brand-dark'

// Emit CSS variables...
toCSSString(dark, { selector: '[data-theme="brand-dark"]', includePalette: true });

// ...or apply to the DOM at runtime (browser):
applyTheme(dark); // writes --ch-* vars + data-theme on the root element</code></pre>
  </DemoCard>
</template>

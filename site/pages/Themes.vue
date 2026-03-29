<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import {
  applyTheme,
  createThemeFromColor,
  toCSSString,
  type ColorMode,
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

// --- Live "apply to an element" demo -------------------------------------
// Two themes that carry semantic tokens (background / surface / text / primary),
// so the preview below actually re-styles itself when a theme is applied.
const previewThemes = computed<ColorTheme[]>(() => [
  {
    name: 'preview-light',
    colorMode: 'light',
    colors: {
      background: '#ffffff',
      surface: '#f1f5f9',
      textPrimary: '#0f172a',
      primary: brand.value,
      border: '#e2e8f0',
    },
    palette: pair.value.light.palette,
  },
  {
    name: 'preview-dark',
    colorMode: 'dark',
    colors: {
      background: '#020617',
      surface: '#0f172a',
      textPrimary: '#e2e8f0',
      primary: pair.value.dark.palette[0],
      border: '#1e293b',
    },
    palette: pair.value.dark.palette,
  },
]);

const previewEl = ref<HTMLElement | null>(null);
const activeMode = ref<ColorMode>('light');

const activePreviewTheme = computed(
  () => previewThemes.value.find((t) => t.colorMode === activeMode.value)!,
);

// Reactively write the active theme's `--ch-*` variables onto the scoped preview
// box (a real `applyTheme` call). Targeting a local element keeps the demo
// self-contained; pass no `target` to write onto `:root` for a whole-page theme.
watchEffect(() => {
  const target = previewEl.value;
  if (!target) {
    return;
  }
  applyTheme(activePreviewTheme.value, { target });
});

function toggleMode() {
  activeMode.value = activeMode.value === 'light' ? 'dark' : 'light';
}
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

  <DemoCard
    title="applyTheme(theme, { target })"
    desc="Apply a theme to an element at runtime: applyTheme writes the theme's colors as --ch-* custom properties (and a data-theme attribute) onto the target. This whole card's preview is styled solely by those variables — switch the mode and tweak the brand color to watch it re-theme live."
  >
    <div class="controls">
      <button class="btn" @click="toggleMode">
        Switch to {{ activeMode === 'light' ? 'dark' : 'light' }}
      </button>
      <span class="note">
        Variables are written onto the preview box only
        (<code>data-theme="{{ activePreviewTheme.name }}"</code>) — drop the
        <code>target</code> option to theme the whole page via <code>:root</code>.
      </span>
    </div>

    <div ref="previewEl" class="preview">
      <div class="preview__bar">
        <span class="preview__dot" />
        <strong>My App</strong>
        <button class="preview__cta">Action</button>
      </div>
      <div class="preview__body">
        <p class="preview__title">Welcome back</p>
        <p class="preview__muted">
          This card is styled entirely with the theme's CSS variables — no inline
          colors. The swatches below come from the theme palette.
        </p>
        <div class="swatches">
          <Swatch
            v-for="(c, i) in activePreviewTheme.palette"
            :key="i"
            :color="c"
            :height="40"
            :show-value="false"
          />
        </div>
      </div>
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import {
  ColorHub,
  createThemeFromColor,
  toCSSString,
  applyTheme,
  bindThemeToDOM,
} from '@bndynet/color-hub';

const { light, dark } = createThemeFromColor('#2563eb', { name: 'brand' });
const hub = new ColorHub([light, dark]); // 'brand-light' / 'brand-dark'

// 1) Emit CSS variables as a string (SSR / build-time tokens)...
toCSSString(dark, { selector: '[data-theme="brand-dark"]', includePalette: true });

// 2) ...or apply a single theme to the DOM at runtime (browser):
applyTheme(dark);                       // writes --ch-* vars + data-theme on :root
applyTheme(dark, { target: el });       // ...or onto a specific element
applyTheme(dark, { prefix: 'app', includePalette: true });

// 3) ...or bind a hub so the DOM re-themes on every switchTheme():
const unbind = bindThemeToDOM(hub, { persist: true });
hub.switchTheme('brand-dark');          // preview updates automatically
// unbind(); // stop syncing when you're done</code></pre>
  </DemoCard>
</template>

<style scoped>
.btn {
  height: 34px;
  padding: 0 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-link);
  background: var(--color-link);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

.preview {
  margin-top: 1rem;
  border: 1px solid var(--ch-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--ch-background);
  color: var(--ch-text-primary);
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.preview__bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  background: var(--ch-surface);
  border-bottom: 1px solid var(--ch-border);
}

.preview__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--ch-primary);
}

.preview__cta {
  margin-left: auto;
  padding: 0.4rem 0.85rem;
  border: none;
  border-radius: 8px;
  background: var(--ch-primary);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

.preview__body {
  padding: 1rem;
}

.preview__title {
  margin: 0 0 0.3rem;
  font-weight: 600;
}

.preview__muted {
  margin: 0 0 0.9rem;
  opacity: 0.7;
}
</style>

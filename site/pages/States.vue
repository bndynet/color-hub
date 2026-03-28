<script setup lang="ts">
import { ref, computed } from 'vue';
import { ColorHub, type ColorMode, type StateColors } from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const base = ref('#2563eb');
const mode = ref<ColorMode>('light');

const STATE_ORDER = ['default', 'hover', 'active', 'disabled', 'focus', 'selected'] as const;

const states = computed<StateColors>(() => {
  const hub = new ColorHub([
    { name: 't', colorMode: mode.value, palette: [base.value], colorMap: {} },
  ]);
  return hub.getColors('demo');
});
</script>

<template>
  <h1>State Colors</h1>
  <p class="lead">
    For every base color, <code>getColors(key)</code> derives
    <code>default / hover / active / disabled / focus / selected</code>. Defaults
    are <strong>colorMode‑aware</strong> — dark mode lightens hover more and darkens
    active less. Provide a <code>stateRecipe</code> to fully customize them.
  </p>

  <DemoCard title="The six states" desc="Pick a base color and a color mode to see the derived states.">
    <div class="controls">
      <ColorField v-model="base" label="Base color" />
      <label class="field">
        <span class="field__label">colorMode</span>
        <select v-model="mode">
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>
    </div>
    <div class="grid">
      <Swatch v-for="s in STATE_ORDER" :key="s" :color="states[s]" :label="s" />
    </div>
  </DemoCard>

  <DemoCard
    title="Live button"
    desc="A real button wired to the derived states — hover and press it to feel the result."
  >
    <button
      class="state-btn"
      :style="{
        '--c-default': states.default,
        '--c-hover': states.hover,
        '--c-active': states.active,
        color: '#fff',
      }"
    >
      Hover &amp; click me
    </button>
    <button
      class="state-btn"
      disabled
      :style="{ background: states.disabled, color: '#fff' }"
    >
      Disabled
    </button>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { ColorHub, lighten, darken } from '@bndynet/color-hub';

const hub = new ColorHub([
  { name: 'light', colorMode: 'light', palette: ['#2563eb'], colorMap: {} },
]);

const s = hub.getColors('primary');
s.default; s.hover; s.active; s.disabled; s.focus; s.selected;

// Customize via a stateRecipe (hub-level or per-theme):
new ColorHub(themes, {
  stateRecipe: {
    hover: (base, hub) =>
      hub.getCurrentTheme().colorMode === 'dark'
        ? darken(base, 0.08)
        : lighten(base, 0.12),
  },
});</code></pre>
  </DemoCard>
</template>

<style scoped>
.state-btn {
  background: var(--c-default);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  margin-right: 0.6rem;
  transition: background 0.12s ease;
}

.state-btn:hover:not(:disabled) {
  background: var(--c-hover);
}

.state-btn:active:not(:disabled) {
  background: var(--c-active);
}

.state-btn:disabled {
  cursor: not-allowed;
}
</style>

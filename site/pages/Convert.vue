<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  isValidColor,
  toRgb,
  toHsl,
  toHslString,
  toOklch,
  toOklchString,
  randomColor,
  randomChartColor,
  randomDistinctColor,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const input = ref('#2563eb');
const valid = computed(() => isValidColor(input.value));

const rgb = computed(() => (valid.value ? toRgb(input.value) : null));
const hsl = computed(() => (valid.value ? toHsl(input.value) : null));
const oklch = computed(() => (valid.value ? toOklch(input.value) : null));

const randoms = ref<{ fn: string; color: string }[]>([]);
function roll() {
  randoms.value = [
    { fn: 'randomColor', color: randomColor() },
    { fn: 'randomChartColor', color: randomChartColor() },
    { fn: 'randomDistinctColor', color: randomDistinctColor() },
  ];
}
roll();

function n(v: number, d = 2) {
  return Number(v.toFixed(d));
}
</script>

<template>
  <h1>Parse &amp; Convert</h1>
  <p class="lead">
    Validate any CSS color string and read it back in RGB, HSL, and OKLCH. OKLCH
    output is perceptually uniform and renders natively in modern browsers.
  </p>

  <DemoCard title="Conversions" desc="Type any CSS color: hex, rgb(), hsl(), named colors…">
    <div class="controls">
      <ColorField v-model="input" label="Color" />
      <span class="value-pill">isValidColor → {{ valid }}</span>
    </div>

    <template v-if="valid && rgb && hsl && oklch">
      <Swatch :color="input" :height="56" style="margin-bottom: 0.9rem" />
      <p class="result-line">
        <strong>toRgb:</strong>
        <span class="value-pill">{{ `{ r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}, a: ${rgb.a} }` }}</span>
      </p>
      <p class="result-line">
        <strong>toHsl:</strong>
        <span class="value-pill">{{ `{ h: ${n(hsl.h)}, s: ${n(hsl.s)}, l: ${n(hsl.l)}, a: ${hsl.a} }` }}</span>
      </p>
      <p class="result-line">
        <strong>toHslString:</strong>
        <span class="value-pill">{{ toHslString(input) }}</span>
      </p>
      <p class="result-line">
        <strong>toOklch:</strong>
        <span class="value-pill">{{ `{ l: ${n(oklch.l, 4)}, c: ${n(oklch.c, 4)}, h: ${n(oklch.h, 2)} }` }}</span>
      </p>
      <p class="result-line">
        <strong>toOklchString:</strong>
        <span class="value-pill">{{ toOklchString(input) }}</span>
      </p>
    </template>
    <p v-else class="note">Not a recognizable color — try <code>#2563eb</code> or <code>rebeccapurple</code>.</p>
  </DemoCard>

  <DemoCard
    title="Random helpers"
    desc="Three strategies: fully random, HSL-controlled (good for charts), and golden-ratio (well-spread)."
  >
    <div class="controls">
      <button class="btn" @click="roll">Roll again</button>
    </div>
    <div class="grid">
      <Swatch v-for="r in randoms" :key="r.fn" :color="r.color" :label="r.fn" />
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { toRgb, toHsl, toOklchString, isValidColor } from '@bndynet/color-hub';

isValidColor('rebeccapurple');   // true
toRgb('#2563eb');                // { r, g, b, a }
toHsl('#2563eb');                // { h, s, l, a }
toOklchString('#ff0000');        // 'oklch(0.628 0.2577 29.2339)'</code></pre>
  </DemoCard>
</template>

<style scoped>
.btn {
  height: 36px;
  padding: 0 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-link);
  background: var(--color-link);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>

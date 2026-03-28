<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  lighten,
  darken,
  saturate,
  desaturate,
  invert,
  grayscale,
  rotateHue,
  alpha,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import RangeField from '../components/RangeField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const base = ref('#2563eb');
const amount = ref(0.15);
const degrees = ref(180);
const alphaValue = ref(0.5);

const single = computed(() => [
  { fn: 'lighten', color: lighten(base.value, amount.value) },
  { fn: 'darken', color: darken(base.value, amount.value) },
  { fn: 'saturate', color: saturate(base.value, amount.value) },
  { fn: 'desaturate', color: desaturate(base.value, amount.value) },
  { fn: 'invert', color: invert(base.value) },
  { fn: 'grayscale', color: grayscale(base.value) },
]);
</script>

<template>
  <h1>Color Adjustments</h1>
  <p class="lead">
    Single‑color transforms in HSL. Each helper accepts any CSS color string and
    returns a hex string. Move the sliders to see the effect update live.
  </p>

  <DemoCard
    title="Lighten / darken / saturation / invert"
    desc="lighten · darken · saturate · desaturate share the same amount (0–1). invert mirrors HSL lightness, grayscale removes saturation."
  >
    <div class="controls">
      <ColorField v-model="base" label="Base color" />
      <RangeField v-model="amount" label="amount" :min="0" :max="1" :step="0.01" />
    </div>
    <div class="grid">
      <Swatch :color="base" label="base" sub="input" />
      <Swatch
        v-for="item in single"
        :key="item.fn"
        :color="item.color"
        :label="item.fn"
        :sub="`${item.fn}('${base}'${item.fn === 'invert' || item.fn === 'grayscale' ? '' : `, ${amount}`})`"
      />
    </div>
  </DemoCard>

  <DemoCard
    title="rotateHue"
    desc="Rotate the hue around the color wheel. 180° gives the complementary color."
  >
    <div class="controls">
      <ColorField v-model="base" label="Base color" />
      <RangeField v-model="degrees" label="degrees" :min="0" :max="360" :step="1" suffix="°" />
    </div>
    <div class="swatches">
      <Swatch :color="base" label="base" />
      <Swatch
        :color="rotateHue(base, degrees)"
        label="rotated"
        :sub="`rotateHue('${base}', ${degrees})`"
      />
      <Swatch :color="rotateHue(base, 180)" label="+180°" sub="complementary" />
    </div>
  </DemoCard>

  <DemoCard
    title="alpha"
    desc="Set the alpha channel (0–1). The hex result includes the alpha byte (#rrggbbaa) when needed."
  >
    <div class="controls">
      <ColorField v-model="base" label="Base color" />
      <RangeField v-model="alphaValue" label="alpha" :min="0" :max="1" :step="0.05" />
    </div>
    <div class="swatches">
      <Swatch :color="base" label="opaque" />
      <Swatch
        :color="alpha(base, alphaValue)"
        label="with alpha"
        :sub="`alpha('${base}', ${alphaValue})`"
      />
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import {
  lighten, darken, saturate, desaturate,
  invert, grayscale, rotateHue, alpha,
} from '@bndynet/color-hub';

lighten('#2563eb', 0.15);   // HSL lighten
rotateHue('#2563eb', 180);  // complementary hue
alpha('#2563eb', 0.5);      // '#2563eb80'</code></pre>
  </DemoCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  createInterpolator,
  createDivergingInterpolator,
  sample,
  type InterpolateSpace,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import RangeField from '../components/RangeField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const s1 = ref('#2563eb');
const s2 = ref('#facc15');
const s3 = ref('#dc2626');
const space = ref<InterpolateSpace>('oklab');
const t = ref(0.5);

const interp = computed(() => createInterpolator([s1.value, s2.value, s3.value], { space: space.value }));
const valueAtT = computed(() => interp.value(t.value));

const gradientCss = computed(() => {
  const stops = sample([s1.value, s2.value, s3.value], 24, { space: space.value });
  return `linear-gradient(90deg, ${stops.join(',')})`;
});

const low = ref('#2563eb');
const mid = ref('#f8fafc');
const high = ref('#dc2626');
const corr = ref(0.5);
const diverging = computed(() => createDivergingInterpolator(low.value, mid.value, high.value));
const corrColor = computed(() => diverging.value(corr.value));
</script>

<template>
  <h1>Interpolation</h1>
  <p class="lead">
    Map a continuous value in <code>[0, 1]</code> to a color across your own stop
    colors. Great for heatmaps, choropleths, and any value → color mapping.
    Interpolation defaults to Oklab; switch to sRGB to compare.
  </p>

  <DemoCard
    title="createInterpolator(stops)"
    desc="Three stops spread evenly over [0, 1]. Drag t to sample a color anywhere on the scale."
  >
    <div class="controls">
      <ColorField v-model="s1" label="Stop 0.0" />
      <ColorField v-model="s2" label="Stop 0.5" />
      <ColorField v-model="s3" label="Stop 1.0" />
      <label class="field">
        <span class="field__label">space</span>
        <select v-model="space">
          <option value="oklab">oklab</option>
          <option value="srgb">srgb</option>
        </select>
      </label>
    </div>
    <div class="gradient-bar" :style="{ background: gradientCss }" />
    <div class="controls" style="margin-top: 1rem">
      <RangeField v-model="t" label="t" :min="0" :max="1" :step="0.01" />
      <Swatch :color="valueAtT" label="interp(t)" :sub="`interp(${t})`" />
    </div>
  </DemoCard>

  <DemoCard
    title="createDivergingInterpolator(low, mid, high)"
    desc="A fixed neutral midpoint at t = 0.5 — perfect for signed data such as correlation (-1…+1) or profit/loss."
  >
    <div class="controls">
      <ColorField v-model="low" label="low (t=0)" />
      <ColorField v-model="mid" label="mid (t=0.5)" />
      <ColorField v-model="high" label="high (t=1)" />
    </div>
    <div
      class="gradient-bar"
      :style="{ background: `linear-gradient(90deg, ${low}, ${mid}, ${high})` }"
    />
    <div class="controls" style="margin-top: 1rem">
      <RangeField v-model="corr" label="value" :min="0" :max="1" :step="0.01" />
      <Swatch :color="corrColor" label="color" />
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { createInterpolator, createDivergingInterpolator, sample } from '@bndynet/color-hub';

const heat = createInterpolator(['#2563eb', '#facc15', '#dc2626']);
heat(0);    // ≈ '#2563eb'
heat(0.5);  // ≈ '#facc15'

const corr = createDivergingInterpolator('#2563eb', '#f8fafc', '#dc2626');
corr(0.5);  // neutral midpoint

sample(['#2563eb', '#dc2626'], 5);  // 5 colors, inclusive endpoints</code></pre>
  </DemoCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { simulate, simulateAll, deltaEOK, type CvdType } from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const types: CvdType[] = ['protanopia', 'deuteranopia', 'tritanopia'];

const color = ref('#d62728');
const sim = computed(() => simulateAll(color.value));

// A small palette to robustness-check.
const palette = ref(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']);
const checkType = ref<CvdType>('deuteranopia');

// Find the closest (riskiest) pair under the selected deficiency.
const riskiestPair = computed(() => {
  const cols = palette.value;
  let worst = { i: 0, j: 1, d: Infinity };
  for (let i = 0; i < cols.length; i++) {
    for (let j = i + 1; j < cols.length; j++) {
      const d = deltaEOK(
        simulate(cols[i], checkType.value),
        simulate(cols[j], checkType.value),
      );
      if (d < worst.d) worst = { i, j, d };
    }
  }
  return worst;
});
</script>

<template>
  <h1>Color‑Vision‑Deficiency Simulation</h1>
  <p class="lead">
    Simulate how colors are perceived under <code>protanopia</code>,
    <code>deuteranopia</code>, and <code>tritanopia</code> (Machado et al. 2009).
    The intended use is a <strong>palette robustness check</strong>: simulate your
    chart colors, then measure distance to find pairs that collapse.
  </p>

  <DemoCard title="simulate / simulateAll" desc="See one color under each type of dichromacy.">
    <div class="controls">
      <ColorField v-model="color" label="Color" />
    </div>
    <div class="swatches">
      <Swatch :color="color" label="original" />
      <Swatch v-for="t in types" :key="t" :color="sim[t]" :label="t" :sub="sim[t]" />
    </div>
  </DemoCard>

  <DemoCard
    title="Palette robustness check"
    desc="Each row simulates the whole palette. The pair with the smallest perceptual distance is the most at-risk of being confused."
  >
    <div class="controls">
      <label class="field">
        <span class="field__label">simulate as</span>
        <select v-model="checkType">
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
      </label>
    </div>

    <p class="result-line"><strong>Original palette</strong></p>
    <div class="swatches" style="margin-bottom: 0.9rem">
      <Swatch v-for="(c, i) in palette" :key="i" :color="c" :height="48" :show-value="false" />
    </div>

    <p class="result-line"><strong>Simulated ({{ checkType }})</strong></p>
    <div class="swatches">
      <Swatch
        v-for="(c, i) in palette"
        :key="i"
        :color="simulate(c, checkType)"
        :height="48"
        :show-value="false"
      />
    </div>

    <p class="note" style="margin-top: 1rem">
      Closest pair under <strong>{{ checkType }}</strong>: colors
      <strong>#{{ riskiestPair.i + 1 }}</strong> and
      <strong>#{{ riskiestPair.j + 1 }}</strong> — ΔEOK
      <span class="value-pill">{{ riskiestPair.d.toFixed(4) }}</span>.
      Values below ~0.08 are hard to distinguish; swap one out if needed.
    </p>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { simulate, simulateAll, deltaEOK } from '@bndynet/color-hub';

simulate('#ff0000', 'deuteranopia');   // shifts toward olive/yellow
simulateAll('#ff0000');                 // { protanopia, deuteranopia, tritanopia }

// Are two series still distinguishable for deuteranopes?
const safe = deltaEOK(
  simulate('#d62728', 'deuteranopia'),
  simulate('#2ca02c', 'deuteranopia'),
) > 0.08;</code></pre>
  </DemoCard>
</template>

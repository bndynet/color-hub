<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  deltaE76,
  deltaEOK,
  distinctColorPerceptual,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const a = ref('#d62728');
const b = ref('#2ca02c');

const de76 = computed(() => deltaE76(a.value, b.value));
const deOK = computed(() => deltaEOK(a.value, b.value));

const existing = ref<string[]>(['#2563eb', '#16a34a', '#f97316']);

function addDistinct() {
  existing.value = [
    ...existing.value,
    distinctColorPerceptual(existing.value, { metric: 'de76' }),
  ];
}
function reset() {
  existing.value = ['#2563eb', '#16a34a', '#f97316'];
}
</script>

<template>
  <h1>Perceptual Distance</h1>
  <p class="lead">
    Measure how different two colors look. <code>deltaE76</code> uses CIELAB;
    <code>deltaEOK</code> uses Oklab (more perceptually uniform, on a much smaller
    scale — black↔white ≈ 1.0). Use these to keep chart series visually distinct.
  </p>

  <DemoCard title="deltaE76 · deltaEOK" desc="Lower numbers mean the colors are harder to tell apart.">
    <div class="controls">
      <ColorField v-model="a" label="Color A" />
      <ColorField v-model="b" label="Color B" />
    </div>
    <div class="swatches" style="margin-bottom: 0.9rem">
      <Swatch :color="a" label="A" />
      <Swatch :color="b" label="B" />
    </div>
    <p class="result-line">
      <strong>deltaE76:</strong>
      <span class="value-pill">{{ de76.toFixed(2) }}</span>
      &nbsp;(CIELAB; “just noticeable” ≈ 2.3, distinct ≈ 23+)
    </p>
    <p class="result-line">
      <strong>deltaEOK:</strong>
      <span class="value-pill">{{ deOK.toFixed(4) }}</span>
      &nbsp;(Oklab; distinct ≈ 0.08+)
    </p>
  </DemoCard>

  <DemoCard
    title="distinctColorPerceptual(existing)"
    desc="Generate a new color that is perceptually far from the ones you already have. Click to keep adding distinct colors."
  >
    <div class="controls">
      <button class="btn" @click="addDistinct">+ Add distinct color</button>
      <button class="btn btn--ghost" @click="reset">Reset</button>
    </div>
    <div class="grid">
      <Swatch v-for="(c, i) in existing" :key="i" :color="c" :label="'#' + (i + 1)" />
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { deltaE76, deltaEOK, distinctColorPerceptual } from '@bndynet/color-hub';

deltaE76('#d62728', '#2ca02c');   // CIELAB distance
deltaEOK('#d62728', '#2ca02c');   // Oklab distance (smaller scale)

// Pick a color well-separated from an existing palette:
distinctColorPerceptual(['#2563eb', '#16a34a'], { metric: 'deOK' });</code></pre>
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

.btn--ghost {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}
</style>

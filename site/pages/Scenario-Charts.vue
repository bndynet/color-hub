<script setup lang="ts">
import { ref, computed } from 'vue';
import { ColorHub } from '@bndynet/color-hub';
import DemoCard from '../components/DemoCard.vue';

const seriesNames = ['Search', 'Direct', 'Referral', 'Social', 'Email', 'Affiliate'];

// Stable, order-independent colors via hash assignment + perceptual fallback.
const hub = new ColorHub(
  [
    {
      name: 'light',
      palette: ['#2563eb', '#14b8a6', '#f97316', '#8b5cf6'],
      colorMap: {},
    },
  ],
  { assignment: 'hash', paletteExhaustion: 'perceptual' },
);

const series = computed(() =>
  seriesNames.map((name) => ({ name, color: hub.getColors(name).default, states: hub.getColors(name) })),
);

const data = ref<number[][]>([]);
function regenerate() {
  data.value = ['Q1', 'Q2', 'Q3', 'Q4'].map(() =>
    seriesNames.map(() => 20 + Math.round(Math.random() * 80)),
  );
}
regenerate();

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const max = computed(() => Math.max(...data.value.flat(), 1));
</script>

<template>
  <h1>Scenario · Chart Series Colors</h1>
  <p class="lead">
    The classic use case: give every chart series a stable, distinguishable color
    by name. With <code>assignment: 'hash'</code> a series keeps its color across
    renders and reloads; <code>paletteExhaustion: 'perceptual'</code> generates
    well‑separated colors once the palette runs out.
  </p>

  <DemoCard title="Grouped bar chart" desc="Bars are colored by series name; hover uses the derived hover state.">
    <div class="legend">
      <span v-for="s in series" :key="s.name" class="legend__item">
        <span class="legend__dot" :style="{ background: s.color }" />
        {{ s.name }}
      </span>
    </div>

    <div class="chart">
      <div v-for="(group, gi) in data" :key="gi" class="chart__group">
        <div class="chart__bars">
          <div
            v-for="(value, si) in group"
            :key="si"
            class="chart__bar"
            :style="{
              height: (value / max) * 140 + 'px',
              '--bar': series[si].color,
              '--bar-hover': series[si].states.hover,
            }"
            :title="`${series[si].name}: ${value}`"
          />
        </div>
        <span class="chart__label">{{ quarters[gi] }}</span>
      </div>
    </div>

    <div class="controls" style="margin-top: 1rem">
      <button class="btn" @click="regenerate">Regenerate data</button>
    </div>
    <p class="note" style="margin-top: 0.8rem">
      Notice the colors never change when you regenerate — each series name maps to
      a fixed color.
    </p>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { ColorHub } from '@bndynet/color-hub';

const hub = new ColorHub(
  [{ name: 'light', palette: ['#2563eb', '#14b8a6', '#f97316', '#8b5cf6'], colorMap: {} }],
  { assignment: 'hash', paletteExhaustion: 'perceptual' },
);

const datasets = seriesNames.map((name) => {
  const c = hub.getColors(name);
  return { label: name, backgroundColor: c.default, hoverBackgroundColor: c.hover };
});</code></pre>
  </DemoCard>
</template>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-bottom: 1rem;
}

.legend__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.legend__dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.chart {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  padding: 1rem 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  min-height: 160px;
}

.chart__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.chart__bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 140px;
}

.chart__bar {
  width: 14px;
  border-radius: 3px 3px 0 0;
  background: var(--bar);
  transition: background 0.12s ease;
}

.chart__bar:hover {
  background: var(--bar-hover);
}

.chart__label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

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

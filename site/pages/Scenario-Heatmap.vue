<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  createInterpolator,
  createDivergingInterpolator,
  contrastText,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import DemoCard from '../components/DemoCard.vue';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 12 }, (_, i) => i * 2);

// Sequential heatmap (activity 0..1).
const low = ref('#f0f9ff');
const high = ref('#0c4a6e');
const heat = computed(() => createInterpolator([low.value, high.value]));

const activity = ref<number[][]>([]);
function regenActivity() {
  activity.value = days.map(() =>
    hours.map(() => Math.round(Math.random() * 100) / 100),
  );
}
regenActivity();

// Diverging correlation matrix (-1..+1).
const negColor = ref('#2563eb');
const midColor = ref('#f8fafc');
const posColor = ref('#dc2626');
const corr = computed(() =>
  createDivergingInterpolator(negColor.value, midColor.value, posColor.value),
);
const vars = ['rev', 'cost', 'churn', 'nps', 'ads'];
const matrix = computed(() =>
  vars.map((_, i) =>
    vars.map((_, j) =>
      i === j ? 1 : Math.round((Math.random() * 2 - 1) * 100) / 100,
    ),
  ),
);
</script>

<template>
  <h1>Scenario · Data Heatmaps</h1>
  <p class="lead">
    Map continuous values to color with interpolators. Use a
    <strong>sequential</strong> scale for magnitudes and a
    <strong>diverging</strong> scale (fixed neutral midpoint) for signed data.
  </p>

  <DemoCard
    title="Sequential heatmap"
    desc="Activity by day × hour, mapped from two stops through Oklab. Text color is auto-picked with contrastText."
  >
    <div class="controls">
      <ColorField v-model="low" label="low (0)" />
      <ColorField v-model="high" label="high (1)" />
      <button class="btn" @click="regenActivity">Regenerate</button>
    </div>
    <div class="heat" :style="{ gridTemplateColumns: `auto repeat(${hours.length}, 1fr)` }">
      <span class="heat__corner" />
      <span v-for="h in hours" :key="'h' + h" class="heat__head">{{ h }}h</span>
      <template v-for="(row, di) in activity" :key="di">
        <span class="heat__row">{{ days[di] }}</span>
        <span
          v-for="(v, hi) in row"
          :key="hi"
          class="heat__cell"
          :style="{ background: heat(v) }"
          :title="`${days[di]} ${hours[hi]}h: ${v}`"
        />
      </template>
    </div>
  </DemoCard>

  <DemoCard
    title="Diverging correlation matrix"
    desc="Values from -1 to +1. The midpoint stays neutral, so positive/negative directions read instantly."
  >
    <div class="controls">
      <ColorField v-model="negColor" label="-1" />
      <ColorField v-model="midColor" label="0" />
      <ColorField v-model="posColor" label="+1" />
    </div>
    <div class="heat" :style="{ gridTemplateColumns: `auto repeat(${vars.length}, 1fr)` }">
      <span class="heat__corner" />
      <span v-for="v in vars" :key="'c' + v" class="heat__head">{{ v }}</span>
      <template v-for="(row, i) in matrix" :key="i">
        <span class="heat__row">{{ vars[i] }}</span>
        <span
          v-for="(value, j) in row"
          :key="j"
          class="heat__cell heat__cell--text"
          :style="{
            background: corr((value + 1) / 2),
            color: contrastText(corr((value + 1) / 2)),
          }"
        >
          {{ value.toFixed(2) }}
        </span>
      </template>
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { createInterpolator, createDivergingInterpolator, contrastText } from '@bndynet/color-hub';

// Sequential: magnitude 0..1
const heat = createInterpolator(['#f0f9ff', '#0c4a6e']);
cell.style.background = heat(value);

// Diverging: signed -1..+1 (map to 0..1)
const corr = createDivergingInterpolator('#2563eb', '#f8fafc', '#dc2626');
const bg = corr((value + 1) / 2);
cell.style.color = contrastText(bg); // readable label</code></pre>
  </DemoCard>
</template>

<style scoped>
.heat {
  display: grid;
  gap: 3px;
  align-items: center;
}

.heat__corner {
  width: 100%;
}

.heat__head,
.heat__row {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.heat__row {
  text-align: right;
  padding-right: 0.4rem;
}

.heat__cell {
  height: 30px;
  border-radius: 4px;
}

.heat__cell--text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

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
</style>

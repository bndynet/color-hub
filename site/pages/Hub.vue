<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ColorHub, type KeyAssignment } from '@bndynet/color-hub';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const palette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'];
const assignment = ref<KeyAssignment>('sequential');
const keys = ref<string[]>(['Sales', 'Profit', 'Cost', 'Tax', 'Revenue']);
const newKey = ref('');

// Recompute assignments whenever the keys or assignment strategy change.
const assigned = computed(() => {
  const hub = new ColorHub(
    [{ name: 'light', palette: [...palette], colorMap: {} }],
    { assignment: assignment.value },
  );
  return keys.value.map((k) => ({ key: k, color: hub.getColors(k).default }));
});

function addKey() {
  const k = newKey.value.trim();
  if (k && !keys.value.includes(k)) keys.value.push(k);
  newKey.value = '';
}
function shuffle() {
  keys.value = [...keys.value].sort(() => Math.random() - 0.5);
}

// Demonstrate stability: with 'hash', shuffling keeps each key's color.
const note = computed(() =>
  assignment.value === 'hash'
    ? 'hash: the same key always maps to the same palette color — shuffle the order and colors stay put.'
    : 'sequential: colors are handed out in request order — shuffle to see assignments change.',
);
watch(assignment, () => {});
</script>

<template>
  <h1>Key → Color Assignment</h1>
  <p class="lead">
    <code>ColorHub</code> assigns a color from the theme palette to each string
    key (e.g. a chart series name). This keeps series colors consistent without
    hand‑maintaining a map.
  </p>

  <DemoCard title="Palette" desc="The active theme palette colors are handed out to keys in order.">
    <div class="swatches">
      <Swatch v-for="(c, i) in palette" :key="i" :color="c" :label="'palette[' + i + ']'" :height="52" />
    </div>
  </DemoCard>

  <DemoCard
    title="getColors(key).default"
    desc="Add keys and watch each one receive a color. Switch the assignment strategy and shuffle to compare behavior."
  >
    <div class="controls">
      <label class="field">
        <span class="field__label">assignment</span>
        <select v-model="assignment">
          <option value="sequential">sequential</option>
          <option value="hash">hash</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">add key</span>
        <span class="field__row">
          <input
            class="field__hex"
            style="width: 11em"
            v-model="newKey"
            placeholder="Series name"
            @keyup.enter="addKey"
          />
          <button class="btn" @click="addKey">Add</button>
        </span>
      </label>
      <button class="btn btn--ghost" @click="shuffle">Shuffle order</button>
    </div>

    <div class="grid">
      <Swatch v-for="item in assigned" :key="item.key" :color="item.color" :label="item.key" />
    </div>

    <p class="note" style="margin-top: 1rem">{{ note }}</p>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { ColorHub } from '@bndynet/color-hub';

const hub = new ColorHub(
  [{ name: 'light', palette: ['#1f77b4', '#ff7f0e', '#2ca02c'], colorMap: {} }],
  { assignment: 'hash' }, // stable, order-independent colors
);

hub.getColors('Sales').default;   // same color every render
hub.getColors('Profit').default;

// When the palette is exhausted, new colors are generated
// (golden-ratio by default, or perceptual ΔE76 spacing):
new ColorHub(themes, { paletteExhaustion: 'perceptual' });</code></pre>
  </DemoCard>
</template>

<style scoped>
.btn {
  height: 34px;
  padding: 0 0.8rem;
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

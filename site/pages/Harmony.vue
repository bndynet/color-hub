<script setup lang="ts">
import { ref, computed } from 'vue';
import { harmony, type HarmonyScheme } from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import RangeField from '../components/RangeField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const base = ref('#2563eb');
const scheme = ref<HarmonyScheme>('triadic');
const angle = ref(30);
const count = ref(5);

const schemes: HarmonyScheme[] = [
  'complementary',
  'analogous',
  'triadic',
  'tetradic',
  'split-complementary',
  'monochromatic',
];

const colors = computed(() =>
  harmony(base.value, scheme.value, { angle: angle.value, count: count.value }),
);
</script>

<template>
  <h1>Color Harmony</h1>
  <p class="lead">
    Generate color‑wheel schemes from a single base color. Each scheme returns an
    array of hex colors with the base first — ideal for seeding a palette or an
    illustration.
  </p>

  <DemoCard title="harmony(base, scheme)" desc="Choose a base color and a scheme.">
    <div class="controls">
      <ColorField v-model="base" label="Base color" />
      <label class="field">
        <span class="field__label">scheme</span>
        <select v-model="scheme">
          <option v-for="s in schemes" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>
      <RangeField
        v-if="scheme === 'analogous'"
        v-model="angle"
        label="angle"
        :min="10"
        :max="90"
        :step="5"
        suffix="°"
      />
      <RangeField
        v-if="scheme === 'monochromatic'"
        v-model="count"
        label="count"
        :min="2"
        :max="11"
        :step="1"
      />
    </div>
    <div class="swatches">
      <Swatch
        v-for="(c, i) in colors"
        :key="i"
        :color="c"
        :label="i === 0 ? 'base' : '#' + (i + 1)"
      />
    </div>
  </DemoCard>

  <DemoCard title="All schemes at a glance" desc="The current base color across every scheme.">
    <div v-for="s in schemes" :key="s" style="margin-bottom: 0.85rem">
      <p class="result-line"><strong>{{ s }}</strong></p>
      <div class="swatches">
        <Swatch
          v-for="(c, i) in harmony(base, s)"
          :key="i"
          :color="c"
          :height="48"
          :show-value="false"
        />
      </div>
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { harmony, triadic, analogous } from '@bndynet/color-hub';

triadic('#2563eb');                          // 3 colors 120° apart
analogous('#2563eb', 45);                     // base ±45°
harmony('#2563eb', 'split-complementary');    // dispatch by name
harmony('#2563eb', 'monochromatic', { count: 7 });</code></pre>
  </DemoCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { generateScale, type ScaleStop } from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const base = ref('#2563eb');
const STOPS: ScaleStop[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const scale = computed(() => generateScale(base.value));
</script>

<template>
  <h1>Tonal Scales</h1>
  <p class="lead">
    Turn one base color into a Tailwind / Material‑style 11‑stop scale
    (<code>50</code>–<code>950</code>). The base anchors stop <code>500</code>;
    lighter stops blend toward white and darker stops toward black — all in Oklab,
    so the hue stays stable across the ramp.
  </p>

  <DemoCard title="generateScale(base)" desc="Pick a base color and read off the full scale.">
    <div class="controls">
      <ColorField v-model="base" label="Base color (anchors 500)" />
    </div>
    <div class="grid">
      <Swatch
        v-for="stop in STOPS"
        :key="stop"
        :color="scale[stop]"
        :label="String(stop)"
        :height="64"
      />
    </div>
  </DemoCard>

  <DemoCard
    title="As a single band"
    desc="The same scale shown contiguously — useful for previewing a brand ramp."
  >
    <div class="ramp">
      <span
        v-for="stop in STOPS"
        :key="stop"
        :style="{ background: scale[stop] }"
        :title="`${stop}: ${scale[stop]}`"
      />
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { generateScale } from '@bndynet/color-hub';

const blue = generateScale('#2563eb');
blue[50];   // very light tint
blue[500];  // ≈ '#2563eb' (the base)
blue[900];  // deep shade

// Override per-stop blend amounts (+ toward white, - toward black, 0 = base):
generateScale('#2563eb', { mix: { 50: 0.97, 950: -0.78 } });</code></pre>
  </DemoCard>
</template>

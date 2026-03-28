<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  mix,
  mixOklab,
  colorSteps,
  colorStepsOklab,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import RangeField from '../components/RangeField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const a = ref('#2563eb');
const b = ref('#f97316');
const ratio = ref(0.5);
const steps = ref(9);

const srgbRamp = computed(() => colorSteps(a.value, b.value, steps.value));
const oklabRamp = computed(() => colorStepsOklab(a.value, b.value, steps.value));
</script>

<template>
  <h1>Mixing &amp; Ramps</h1>
  <p class="lead">
    Blend two colors and build evenly spaced ramps. <code>mix</code> interpolates
    raw sRGB channels (fast); <code>mixOklab</code> interpolates in Oklab for
    perceptually smoother midpoints — like CSS <code>color-mix(in oklab, …)</code>.
  </p>

  <DemoCard
    title="mix vs mixOklab"
    desc="Same two colors, same ratio. Notice how the sRGB midpoint can look muddier than the Oklab one."
  >
    <div class="controls">
      <ColorField v-model="a" label="Color A" />
      <ColorField v-model="b" label="Color B" />
      <RangeField v-model="ratio" label="ratio" :min="0" :max="1" :step="0.01" />
    </div>
    <div class="swatches">
      <Swatch :color="a" label="A" />
      <Swatch :color="mix(a, b, ratio)" label="mix (sRGB)" :sub="`mix(A, B, ${ratio})`" />
      <Swatch :color="mixOklab(a, b, ratio)" label="mixOklab" :sub="`mixOklab(A, B, ${ratio})`" />
      <Swatch :color="b" label="B" />
    </div>
  </DemoCard>

  <DemoCard
    title="colorSteps vs colorStepsOklab"
    desc="Generate an N-step ramp between two colors. The Oklab ramp keeps lightness changes even across the band."
  >
    <div class="controls">
      <ColorField v-model="a" label="From" />
      <ColorField v-model="b" label="To" />
      <RangeField v-model="steps" label="steps" :min="2" :max="16" :step="1" />
    </div>

    <p class="result-line"><strong>colorSteps</strong> — sRGB channel interpolation</p>
    <div class="ramp">
      <span v-for="(c, i) in srgbRamp" :key="'s' + i" :style="{ background: c }" :title="c" />
    </div>

    <p class="result-line" style="margin-top: 0.9rem">
      <strong>colorStepsOklab</strong> — perceptual Oklab interpolation
    </p>
    <div class="ramp">
      <span v-for="(c, i) in oklabRamp" :key="'o' + i" :style="{ background: c }" :title="c" />
    </div>
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { mix, mixOklab, colorSteps, colorStepsOklab } from '@bndynet/color-hub';

mix('#2563eb', '#f97316', 0.5);        // fast sRGB blend
mixOklab('#2563eb', '#f97316', 0.5);   // perceptual blend

colorSteps('#2563eb', '#f97316', 9);       // 9-color sRGB ramp
colorStepsOklab('#2563eb', '#f97316', 9);  // 9-color Oklab ramp</code></pre>
    <p class="note" style="margin-top: 0.8rem">
      Use Oklab variants for gradients, charts, and heatmaps. Use plain
      <code>mix</code> when you need raw, predictable channel math.
    </p>
  </DemoCard>
</template>

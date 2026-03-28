<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  contrastRatio,
  isAccessible,
  ensureContrast,
  contrastText,
  type WcagLevel,
  type TextSize,
} from '@bndynet/color-hub';
import ColorField from '../components/ColorField.vue';
import Swatch from '../components/Swatch.vue';
import DemoCard from '../components/DemoCard.vue';

const fg = ref('#7c89a8');
const bg = ref('#ffffff');
const level = ref<WcagLevel>('AA');
const size = ref<TextSize>('normal');

const ratio = computed(() => contrastRatio(fg.value, bg.value));
const target = computed(() => ({ level: level.value, size: size.value }));
const pass = computed(() => isAccessible(fg.value, bg.value, target.value));
const fixed = computed(() => ensureContrast(fg.value, bg.value, target.value));
const fixedRatio = computed(() => contrastRatio(fixed.value, bg.value));

const autoBg = ref('#2563eb');
</script>

<template>
  <h1>Contrast &amp; Accessibility</h1>
  <p class="lead">
    WCAG 2.x contrast helpers: measure the ratio, check a level, auto‑fix a
    foreground color until it passes, and pick readable text for any background.
  </p>

  <DemoCard
    title="contrastRatio · isAccessible · ensureContrast"
    desc="Pick a foreground and background. The preview shows live text; ensureContrast nudges the foreground lightness until it meets the target."
  >
    <div class="controls">
      <ColorField v-model="fg" label="Foreground (text)" />
      <ColorField v-model="bg" label="Background" />
      <label class="field">
        <span class="field__label">level</span>
        <select v-model="level">
          <option value="AA">AA</option>
          <option value="AAA">AAA</option>
        </select>
      </label>
      <label class="field">
        <span class="field__label">size</span>
        <select v-model="size">
          <option value="normal">normal</option>
          <option value="large">large</option>
        </select>
      </label>
    </div>

    <div class="cmp">
      <div class="cmp__cell" :style="{ background: bg, color: fg }">
        <strong>Original</strong>
        <p>The quick brown fox jumps over the lazy dog.</p>
        <span class="value-pill">ratio {{ ratio.toFixed(2) }} · {{ pass ? 'PASS ✓' : 'FAIL ✕' }}</span>
      </div>
      <div class="cmp__cell" :style="{ background: bg, color: fixed }">
        <strong>ensureContrast</strong>
        <p>The quick brown fox jumps over the lazy dog.</p>
        <span class="value-pill">{{ fixed }} · ratio {{ fixedRatio.toFixed(2) }}</span>
      </div>
    </div>
  </DemoCard>

  <DemoCard
    title="contrastText(background)"
    desc="Automatically choose black or white (or your own pair) for readable text on a solid fill."
  >
    <div class="controls">
      <ColorField v-model="autoBg" label="Background" />
    </div>
    <Swatch :color="autoBg" :label="`text → ${contrastText(autoBg)}`" :height="90" />
  </DemoCard>

  <DemoCard title="Usage">
    <pre><code>import { contrastRatio, isAccessible, ensureContrast, contrastText } from '@bndynet/color-hub';

contrastRatio('#777', '#fff');                       // ~4.48
isAccessible('#777', '#fff');                        // false (AA needs ≥ 4.5)
ensureContrast('#9bbcff', '#ffffff');                // darkened until ≥ 4.5:1
ensureContrast('#1f3a8a', '#000', { level: 'AAA' }); // lightened until ≥ 7:1
contrastText('#2563eb');                             // '#ffffff'</code></pre>
  </DemoCard>
</template>

<style scoped>
.cmp {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.cmp__cell {
  padding: 1rem 1.1rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.cmp__cell p {
  margin: 0.5rem 0 0.75rem;
  line-height: 1.5;
}
</style>

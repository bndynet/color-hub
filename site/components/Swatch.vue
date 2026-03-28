<script setup lang="ts">
import { computed } from 'vue';
import { contrastText, isValidColor } from '@bndynet/color-hub';

const props = withDefaults(
  defineProps<{
    color: string;
    label?: string;
    sub?: string;
    /** Swatch height in px. */
    height?: number;
    /** Show the resolved hex value inside the swatch. */
    showValue?: boolean;
  }>(),
  { height: 72, showValue: true },
);

const valid = computed(() => isValidColor(props.color));
const textColor = computed(() =>
  valid.value ? contrastText(props.color) : 'var(--color-text)',
);
</script>

<template>
  <div class="swatch">
    <div
      class="swatch__chip"
      :style="{
        background: valid ? color : 'transparent',
        color: textColor,
        height: height + 'px',
      }"
    >
      <span v-if="label" class="swatch__label">{{ label }}</span>
      <span v-if="showValue" class="swatch__value">{{ color }}</span>
    </div>
    <div v-if="sub" class="swatch__sub">{{ sub }}</div>
  </div>
</template>

<style scoped>
.swatch {
  min-width: 96px;
}

.swatch__chip {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.45rem 0.55rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  font-size: 0.78rem;
}

.swatch__label {
  font-weight: 600;
}

.swatch__value {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  opacity: 0.85;
}

.swatch__sub {
  margin-top: 0.3rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
</style>

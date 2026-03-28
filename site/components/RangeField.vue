<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
  }>(),
  { min: 0, max: 1, step: 0.01, suffix: '' },
);
const model = defineModel<number>({ required: true });

function onInput(event: Event) {
  model.value = Number((event.target as HTMLInputElement).value);
}
</script>

<template>
  <label class="field">
    <span v-if="label" class="field__label">
      {{ label }} <span class="value-pill">{{ model }}{{ suffix }}</span>
    </span>
    <input
      class="field__range"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="model"
      @input="onInput"
    />
  </label>
</template>

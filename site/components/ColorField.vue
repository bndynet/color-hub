<script setup lang="ts">
defineProps<{ label?: string }>();
const model = defineModel<string>({ required: true });

function onInput(event: Event) {
  model.value = (event.target as HTMLInputElement).value;
}
</script>

<template>
  <label class="field">
    <span v-if="label" class="field__label">{{ label }}</span>
    <span class="field__row">
      <input type="color" :value="model" @input="onInput" />
      <input class="field__hex" type="text" :value="model" @input="onInput" spellcheck="false" />
    </span>
  </label>
</template>

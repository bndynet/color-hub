<script setup lang="ts">
defineProps<{ title: string; desc?: string }>();
</script>

<template>
  <section class="demo">
    <h3>{{ title }}</h3>
    <p v-if="desc" class="demo__desc">{{ desc }}</p>
    <slot />
  </section>
</template>

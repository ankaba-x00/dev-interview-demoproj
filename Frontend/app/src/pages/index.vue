<script setup>
  import { computed } from 'vue';
  import { useTheme } from 'vuetify';

  definePage({
    meta: {
      requiresAuth: true,
    },
  });

  const theme = useTheme();

  const isDark = computed(() => theme.global.current.value.dark);
</script>

<template>
  <v-container
    fluid
    class="d-flex align-center justify-center h-100"
  >
    <v-img
      src="/logo_placeholder.png"
      alt="company Logo"
      max-width="500"
      aspect-ratio="auto"
      :class="{ 'logo-light': !isDark }"
      contain
    />
  </v-container>
</template>

<style scoped lang="scss">
  .logo-light {
    filter:
      brightness(0)
      saturate(100%)
      invert(15%)
      sepia(85%)
      saturate(2000%)
      hue-rotate(205deg)
      brightness(90%)
      contrast(95%);
  }
</style>
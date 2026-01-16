<script setup>
  import { computed, onMounted } from 'vue';
  import { useTheme } from 'vuetify';

  const theme = useTheme();

  const isDark = computed(() => theme.global.current.value.dark);

  function toggleTheme () {
    const next = isDark.value ? 'light' : 'dark';
    theme.change(next);
    localStorage.setItem('themeMode', next);
  }

  onMounted(() => {
    const stored = localStorage.getItem('themeMode');

    if (stored !== null) {
      theme.change(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.change(prefersDark ? 'dark' : 'light');
    }
  });
</script>

<template>
  <v-btn
    icon
    variant="text"
    @click="toggleTheme"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <v-icon>
      {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
    </v-icon>
  </v-btn>
</template>
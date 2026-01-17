<script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  import AppLayout from '@/components/layout/AppLayout.vue';
  import AuthLayout from '@/components/layout/AuthLayout.vue';

  const route = useRoute();

  const layout = computed(() =>
    route.meta.layout === 'auth'
      ? AuthLayout
      : AppLayout
  );
</script>

<template>
  <v-app>
    <component :is="layout" />
  </v-app>
</template>
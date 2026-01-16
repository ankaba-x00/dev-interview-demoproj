<script setup>
  import AppLayout from '@/components/layout/AppLayout.vue';
</script>

<template>
  <v-app>
    <AppLayout>
      <router-view />
    </AppLayout>
  </v-app>
</template>

<style lang="scss">
  html,
  body,
  #app {
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
</style>

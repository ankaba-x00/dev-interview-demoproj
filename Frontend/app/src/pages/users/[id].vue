<script setup>
  import UsersView from './index.vue';

  definePage({
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  });
</script>

<template>
  <UsersView />
</template>

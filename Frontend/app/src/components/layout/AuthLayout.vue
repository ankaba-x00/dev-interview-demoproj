<template>
  <v-main class="auth-layout">
    <router-view />
  </v-main>
</template>

<style scoped lang="scss">
  .auth-layout {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>

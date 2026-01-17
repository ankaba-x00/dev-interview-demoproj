<template>
  <v-main class="auth-shell">
    <router-view />
  </v-main>
</template>

<style scoped lang="scss">
  .auth-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>

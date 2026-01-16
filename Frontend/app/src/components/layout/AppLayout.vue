<script setup>
  import { ref, watch } from 'vue';
  import { useDisplay } from 'vuetify';
  import TopBar from './TopBar.vue';
  import SideBar from './SideBar.vue';

  const { smAndDown } = useDisplay();

  const layoutMode = ref('top');
  const collapsed = ref(false);

  function toggleCollapse () {
    collapsed.value = !collapsed.value;
  }

  function setLayoutMode (mode) {
    layoutMode.value = mode;
    collapsed.value = false;
  }

  const storedMode = localStorage.getItem('sideMode');
  if (storedMode) {
    layoutMode.value = storedMode === 'side' ? 'side' : 'top';
  }

  watch(layoutMode, (mode) => {
    localStorage.setItem('sideMode', mode);
  });

  watch(
    smAndDown,
    (isSmall) => {
      if (isSmall) {
        collapsed.value = true;
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="app-shell">
    <TopBar
      v-if="layoutMode === 'top'"
      :collapsed="collapsed"
      @toggle-collapse="toggleCollapse"
      @switch-layout="setLayoutMode"
    />

    <SideBar
      v-else
      :collapsed="collapsed"
      @toggle-collapse="toggleCollapse"
      @switch-layout="setLayoutMode"
    />

    <v-main class="main-scroll">
      <slot />
    </v-main>
  </div>
</template>

<style lang="scss">
  .app-shell {
    height: 100vh;
    display: flex;
    overflow: hidden;
  }

  .main-scroll {
    flex: 1;
    overflow-y: auto;
    min-width: 0;
  }
</style>
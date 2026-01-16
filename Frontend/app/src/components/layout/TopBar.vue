<script setup>
  import CollapseToggle from './CollapseToggle.vue';
  import NavigationItems from './NavigationItems.vue';
  import ThemeToggle from './ThemeToggle.vue';
  import UserMenu from './UserMenu.vue';

  defineProps({
    collapsed: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits([
    'toggle-collapse',
    'switch-layout',
  ]);

  function onLogout () {
    console.log('Logout clicked');
  }
</script>

<template>
  <!-- FULL TOPBAR -->
  <v-app-bar
    v-if="!collapsed"
    app
    class="bg-background"
    elevation="1"
    height="64"
  >
    <!-- Collapse -->
    <CollapseToggle
      :collapsed="false"
      @toggle="$emit('toggle-collapse')"
    />

    <!-- Navigation -->
    <NavigationItems
      orientation="horizontal"
      class="ml-2"
    />

    <v-spacer />

    <!-- Theme toggle -->
    <ThemeToggle class="mr-2" />

    <!-- Switch to sidebar -->
    <v-btn
      icon
      variant="text"
      @click="$emit('switch-layout', 'side')"
      aria-label="Switch to sidebar layout"
    >
      <v-icon>mdi-arrow-bottom-left</v-icon>
    </v-btn>

    <!-- User menu -->
    <UserMenu @logout="onLogout" />
  </v-app-bar>

  <!-- COLLAPSED TOPBAR -->
  <div
    v-else
    class="floating-toggle top"
  >
    <CollapseToggle
      :collapsed="true"
      @toggle="$emit('toggle-collapse')"
    />
  </div>
</template>

<style scoped lang="scss">
  @use '@/styles/utilities' as *;
</style>

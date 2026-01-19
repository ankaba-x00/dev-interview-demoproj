<script setup>
  import CollapseToggle from './CollapseToggle.vue';
  import NavigationItems from './NavigationItems.vue';
  import ThemeToggle from './ThemeToggle.vue';
  import UserMenu from './UserMenu.vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';

  defineProps({
    collapsed: {
      type: Boolean,
      required: true,
    },
  });

  const auth = useAuthStore();
  const router = useRouter();

  const emit = defineEmits([
    'toggle-collapse',
    'switch-layout',
  ]);

  function onLogout () {
    auth.logout();
    router.push('/login');
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
    <UserMenu 
      :username="auth.user?.email"
      @logout="onLogout" 
    />
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
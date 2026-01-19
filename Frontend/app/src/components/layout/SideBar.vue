<script setup>
  import { useDisplay } from 'vuetify';
  import CollapseToggle from './CollapseToggle.vue';
  import NavigationItems from './NavigationItems.vue';
  import ThemeToggle from './ThemeToggle.vue';
  import UserMenu from './UserMenu.vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';

  const props = defineProps({
    collapsed: {
      type: Boolean,
      required: true,
    },
  });

  const auth = useAuthStore();
  const router = useRouter();

  const { smAndDown } = useDisplay();

  const emit = defineEmits([
    'toggle-collapse',
    'switch-layout',
  ]);

  function onLogout() {
    auth.logout();
    router.push('/login');
  }
</script>

<template>
  <!-- FULL SIDEBAR -->
  <v-navigation-drawer
    v-if="!collapsed"
    app
    elevation="1"
    class="bg-background sidebar-fit"
    :width="smAndDown ? 72 : 125"
    permanent
  >
    <!-- Collapse -->
    <v-list-item class="px-2" density="comfortable">
      <CollapseToggle
        :collapsed="false"
        @toggle="$emit('toggle-collapse')"
      />
    </v-list-item>

    <v-divider />

    <!-- Navigation -->
    <NavigationItems
      class="flex-grow-1 overflow-y-auto"
      orientation="vertical"
      :collapsed="smAndDown"
    />

    <template #append>
      <div class="pa-2 d-flex flex-column align-center gap-2">
        <div
          class="d-flex align-center"
          :class="smAndDown ? 'flex-column gap-2' : 'gap-1'"
        >
          <!-- Theme toggle -->
          <ThemeToggle />

          <!-- Switch to topbar -->
          <v-btn
            icon
            variant="text"
            @click="$emit('switch-layout', 'top')"
            aria-label="Switch to topbar layout"
          >
            <v-icon>mdi-arrow-top-right</v-icon>
          </v-btn>
        </div>

        <!-- User menu -->
        <UserMenu 
          :username="auth.user?.email"
          @logout="onLogout" 
        />
      </div>
    </template>
  </v-navigation-drawer>

  <!-- COLLAPSED SIDEBAR -->
  <div
    v-else
    class="floating-toggle side"
  >
    <CollapseToggle
      :collapsed="true"
      @toggle="$emit('toggle-collapse')"
    />
  </div>
</template>

<style scoped lang="scss">
  .sidebar-fit {
    height: 100vh;
  }

  .sidebar-fit :deep(.v-navigation-drawer__content) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>

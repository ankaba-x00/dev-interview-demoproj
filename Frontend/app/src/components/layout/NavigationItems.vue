<script setup>
  import { computed } from 'vue';
  import { useDisplay } from 'vuetify';

  const { smAndDown } = useDisplay();

  defineProps({
    orientation: {
      type: String,
      required: true,
      validator: (v) => ['horizontal', 'vertical'].includes(v),
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  });

  const navItems = computed(() => [
    {
      label: 'Home',
      icon: 'mdi-home',
      color: 'clr1',
      to: '/',
    },
    {
      label: 'Users',
      icon: 'mdi-account-group',
      color: 'clr2',
      to: '/users',
    },
  ]);
</script>

<template>
  <!-- FOR TOPBAR -->
  <div
    v-if="orientation === 'horizontal'"
    class="d-flex align-center"
  >
    <v-btn
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      router
      variant="text"
      :icon="smAndDown"
      :class="['mx-1', `bg-${item.color}`, 'hover-opacity', 'nav-text']"
    >
      <!-- MOBILE: icon-only -->
      <template v-if="smAndDown">
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </template>

      <!-- DESKTOP: icon + label -->
      <template v-else>
        <v-icon start>
          {{ item.icon }}
        </v-icon>
        {{ item.label }}
      </template>
    </v-btn>
  </div>

  <!-- FOR SIDEBAR -->
  <v-list
    v-else
    nav
    density="comfortable"
  >
    <!-- MOBILE: icon-only -->
    <div
      v-if="smAndDown"
      class="d-flex flex-column align-center"
    >
      <v-btn
        v-for="item in navItems"
        :key="`mobile-${item.to}`"
        :to="item.to"
        router
        icon
        variant="text"
        :class="['my-1', `bg-${item.color}`, 'hover-opacity']"
      >
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-btn>
    </div>

    <!-- DESKTOP: icon + label -->
    <v-list-item
      v-for="item in navItems"
      v-else
      :key="`desktop-${item.to}`"
      :to="item.to"
      router
      slim
      rounded="lg"
      density="compact"
      :prepend-icon="item.icon"
      :class="[`bg-${item.color}`, 'hover-opacity']"
    >
      <v-list-item-title class="nav-text">
        {{ item.label }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped lang="scss">
  .nav-text {
    letter-spacing: normal;
    text-transform: uppercase;
  }
</style>

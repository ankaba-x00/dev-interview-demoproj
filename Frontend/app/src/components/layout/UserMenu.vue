<script setup>
  defineProps({
    username: {
      type: String,
      default: 'User',
    },
  });

  const emit = defineEmits(['logout']);

  function logout () {
    emit('logout');
  }
</script>

<template>
  <v-menu
    open-on-hover
    location="bottom end"
    offset="4"
  >
    <!-- PROFILE AREA -->
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        icon
        variant="text"
        class="ml-2"
      >
        <v-avatar size="40" color="clr3">
          <v-icon size="30" color="white">mdi-account</v-icon>
        </v-avatar>
      </v-btn>
    </template>

    <!-- DROPDOWN MENU -->
    <v-list density="comfortable" min-width="160" class="bg-background">
      <v-list-item>
        <v-list-item-title class="font-weight-medium">
          {{ username }}
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-item
        @click="logout"
        prepend-icon="mdi-logout"
        data-test="logout"
      >
        <v-list-item-title>
          Logout
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

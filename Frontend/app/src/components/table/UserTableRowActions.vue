<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from "@/stores/auth";
  import { computed } from "vue";

  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  });

  const auth = useAuthStore();
  const isAdmin = computed(() => auth.isAdmin);

  const route = useRoute();
  const router = useRouter();

  function openAction(action) {
    router.push({
      path: "/users",
      query: {
        ...route.query,
        action,
        id: props.user.id,
      },
    });
  }
</script>

<template>
  <div class="d-flex gap-1">
    <v-tooltip text="Edit" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          :disabled="!isAdmin"
          @click="openAction('edit')"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Delete" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          :disabled="!isAdmin"
          @click="openAction('delete')"
        >
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Block" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          :disabled="!isAdmin"
          @click="openAction('block')"
        >
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>
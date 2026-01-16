<script setup>
  defineProps({
    user: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="d-flex gap-1">
    <v-tooltip text="Edit">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Delete">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
        >
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Block">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
        >
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>

<style scoped lang="scss">
  @use '@/styles/utilities' as *;
</style>

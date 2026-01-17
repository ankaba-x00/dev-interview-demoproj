<script setup>
  const props = defineProps({
    filteredUsers: {
      type: Array,
      required: true,
    },
  });

  const emit = defineEmits(['export']);
</script>

<template>
  <div class="d-flex justify-end">
    <v-tooltip text="Export users">
      <template #activator="{ props: tooltipProps }">
        <v-btn
          v-bind="tooltipProps"
          variant="outlined"
          class="btn-export"
          @click="$emit('export')"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>
<script setup>
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits([
    'update:modelValue',
    'export-full',
    'export-filtered',
  ]);

  function close() {
    emit('update:modelValue', false);
  }

  function exportFull() {
    emit('export-full');
    close();
  }

  function exportFiltered() {
    emit('export-filtered');
    close();
  }
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="420"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card class="pa-2 rounded-lg">
      <v-card-title class="text-h6">
        Export users
      </v-card-title>

      <v-card-text class="pb-2">
        Choose export format of user list
      </v-card-text>

      <v-card-text class="d-flex justify-center py-2">
        <v-btn
          variant="flat"
          color="clr0"
          class="mx-2"
          @click="exportFiltered"
        >
          Filtered list
        </v-btn>

        <v-btn
          variant="flat"
          color="clr0"
          class="mx-2"
          @click="exportFull"
        >
          Full list
        </v-btn>
      </v-card-text>

      <v-card-actions class="justify-end pt-2">
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

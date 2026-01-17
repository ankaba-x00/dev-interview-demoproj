<script setup>
  defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
  });

  const emit = defineEmits(['update:modelValue', 'confirm']);

  function close() {
    emit('update:modelValue', false);
  }

  function confirm() {
    emit('confirm');
    close();
  }
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="420">
    <v-card class="pa-2 rounded-lg">
      <v-card-title class="text-h6">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">
          Cancel
        </v-btn>

        <v-btn 
          variant="flat"
          color="clr0"
          @click="confirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

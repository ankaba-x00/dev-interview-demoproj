<script setup>
  defineProps({
    collapsed: {
      type: Boolean,
      required: true,
    },
  });

  defineEmits(['toggle']);
</script>

<template>
  <v-btn
    icon
    variant="text"
    @click="$emit('toggle')"
    :aria-label="collapsed ? 'Expand navigation' : 'Collapse navigation'"
  >
    <v-icon>
      {{ collapsed ? 'mdi-arrow-expand' : 'mdi-arrow-collapse' }}
    </v-icon>
  </v-btn>
</template>
<script setup>
  import ConfirmDialog from '@/components/common/ConfirmDialog.vue';

  const props = defineProps({
    modelValue: Boolean,
    user: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:modelValue', 'confirm']);

  function onConfirm() {
    emit('confirm', props.user.id);
  }
</script>

<template>
  <ConfirmDialog
    :model-value="modelValue"
    title="Block user"
    :message="`Are you sure you want to block ${user.name}?`"
    confirm-text="Block"
    @update:modelValue="$emit('update:modelValue', $event)"
    @confirm="onConfirm"
  />
</template>

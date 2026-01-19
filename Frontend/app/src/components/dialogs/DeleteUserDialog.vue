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
    emit('confirm', props.user);
  }
</script>

<template>
  <ConfirmDialog
    :model-value="modelValue"
    title="Delete user"
    :message="`Are you sure you want to delete ${user.name}?`"
    confirm-text="Delete"
    @update:modelValue="$emit('update:modelValue', $event)"
    @confirm="onConfirm"
  />
</template>

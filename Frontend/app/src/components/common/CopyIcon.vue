<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    value: {
      type: [String, Number],
      required: true,
    },
    tooltipText: {
      type: String,
      default: 'Copy',
    },
    copiedText: {
      type: String,
      default: 'Copied!',
    },
  });

  const copied = ref(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(String(props.value));
      copied.value = true;

      setTimeout(() => {
        copied.value = false;
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<template>
  <v-tooltip
    location="top"
    :text="copied ? copiedText : tooltipText"
  >
    <template #activator="{ props: tooltipProps }">
      <v-icon
        v-bind="tooltipProps"
        size="14"
        class="copy-icon"
        icon="mdi-content-copy"
        data-no-expand
        @click.stop="copyToClipboard"
      />
    </template>
  </v-tooltip>
</template>

<style scoped lang="scss">
  .copy-icon {
    padding-left: 10px;
    cursor: pointer;
    opacity: 0.35;
    transition: opacity 0.15s ease, transform 0.15s ease;
  
    &:hover {
    opacity: 1;
    transform: scale(1.1);
    }
  }
</style>

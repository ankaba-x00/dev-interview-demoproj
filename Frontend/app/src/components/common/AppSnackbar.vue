<script setup>
  import { computed } from 'vue';
  import { useNotificationStore } from '@/stores/notifications';

  const notify = useNotificationStore();

  const colorClass = computed(() => {
    return `snackbar-${notify.color}`;
  });
</script>

<template>
  <v-snackbar
    v-model="notify.show"
    location="bottom start"
    :timeout="notify.timeout"
    content-class="snackbar-overlay-reset"
    class="snackbar-root"
  >
    <div class="snackbar-content" :class="colorClass">
      <span class="snackbar-text">
        {{ notify.message }}
      </span>

      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        class="snackbar-close"
        @click="notify.show = false"
      />
    </div>
  </v-snackbar>
</template>

<style lang="scss">
  .snackbar-overlay-reset {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    min-width: unset !important;
  }

  .snackbar-root {
    margin: 0 0 24px 24px;
  }

  .snackbar-content {
    display: flex;
    align-items: center;
    gap: 12px;

    min-width: 280px;
    max-width: 360px;
    padding: 10px 16px;

    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .snackbar-text {
    flex: 1;
    line-height: 1.4;
  }

  .snackbar-close {
    margin-left: 4px;
  }

  .snackbar-success {
    border: 2px solid rgb(var(--v-theme-success));
    background-color: color-mix(in srgb, rgb(var(--v-theme-success)) 80%, white 70%);
    color: color-mix(in srgb, rgb(var(--v-theme-success)) 70%, black 30%);  
  }

  .snackbar-error {
    border: 2px solid rgb(var(--v-theme-error));
    background-color: color-mix(in srgb, rgb(var(--v-theme-error)) 80%, white 70%);
    color: color-mix(in srgb, rgb(var(--v-theme-error)) 70%, black 30%);
  }

  .snackbar-warning {
    border: 2px solid rgb(var(--v-theme-warning));
    background-color: color-mix(in srgb, rgb(var(--v-theme-warning)) 80%, white 70%);
    color: color-mix(in srgb, rgb(var(--v-theme-warning)) 70%, black 30%);  
  }

  .snackbar-info {
    border: 2px solid rgb(var(--v-theme-info));
    background-color: color-mix(in srgb, rgb(var(--v-theme-info)) 80%, white 70%);
    color: color-mix(in srgb, rgb(var(--v-theme-info)) 70%, black 30%);
  }
</style>
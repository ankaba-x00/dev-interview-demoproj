<script setup>
  defineProps({
    user: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  });
</script>

<template>
  <div v-if="isAdmin" class="expanded-row">
    <div class="d-flex flex-wrap px-6 pt-1 pb-2">
      <div class="info-block">
        <span class="label">Last login</span>
        <span class="value">{{ user.lastLogin || '—' }}</span>
      </div>
      <div class="info-block">
        <span class="label">IP address</span>
        <span class="value">{{ user.ipAddress || '—' }}</span>
      </div>
    </div>
    <v-divider :thickness="2" />
  </div>
</template>

<style scoped lang="scss">
  .expanded-row {
    background-color: rgba(var(--v-theme-background));
    border-left: 3px solid rgb(var(--v-theme-clr2));
  }

  .info-block {
    display: flex;
    flex-direction: column;
    min-width: 150px;
    padding: 5px;
  }

  .label {
    font-size: 0.75rem;
    color: rgb(var(--v-theme-clr2));
    padding-bottom: 5px;
    text-transform: uppercase;
  }

  .value {
    font-size: 0.875rem;
    font-weight: 500;
  }
</style>

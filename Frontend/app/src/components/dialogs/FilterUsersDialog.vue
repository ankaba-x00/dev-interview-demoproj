<script setup>
  import { reactive, computed, watch } from 'vue';

  const props = defineProps({
    modelValue: Boolean,
    isAdmin: {
      type: Boolean,
      default: false,
    },
  });

  const form = reactive({
    isActive: null,
    isBlocked: null,
    loginRange: null,
    loginFrom: null,
    loginTo: null,
  });

  const loginOptions = [
    { title: 'Last 24 hours', value: '24h' },
    { title: 'Last 3 days', value: '3d' },
    { title: 'Last week', value: '1w' },
    { title: 'Last month', value: '4w' },
  ];

  const customLoginRange = computed(
    () => !!(form.loginFrom || form.loginTo)
  );

  const hasFilters = computed(() =>
    form.isActive !== null ||
    form.isBlocked !== null ||
    (props.isAdmin && (
      form.loginRange ||
      form.loginFrom ||
      form.loginTo
    ))
  );

  const emit = defineEmits(['update:modelValue', 'apply']);

  function close() {
    emit('update:modelValue', false);
  }

  function onSubmit() {
    emit('apply', {
      isActive: form.isActive !== null ? form.isActive : undefined,
      isBlocked: form.isBlocked !== null ? form.isBlocked : undefined,
      loginRange: !customLoginRange.value ? form.loginRange : undefined,
      loginFrom: customLoginRange.value ? form.loginFrom : undefined,
      loginTo: customLoginRange.value ? form.loginTo : undefined,
    });
    close();
  }

  // reset on open
  watch(
    () => props.modelValue,
    open => {
      if (open) {
        form.isActive = null
        form.isBlocked = null
        form.loginRange = null
        form.loginFrom = null
        form.loginTo = null
      }
    }
  );
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="480" persistent>
    <v-card class="pa-2 rounded-lg">
      <v-card-title class="text-h6">
        Filter users
      </v-card-title>

      <v-card-text class="d-flex flex-column gap-4">
        <v-row dense>
          <v-col cols="6">
            <v-checkbox
              :model-value="form.isActive === true"
              label="Active users"
              hide-details
              @update:model-value="val => form.isActive = val ? true : null"
            />
          </v-col>

          <v-col cols="6">
            <v-checkbox
              :model-value="form.isActive === false"
              label="Inactive users"
              hide-details
              @update:model-value="val => form.isActive = val ? false : null"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="6">
            <v-checkbox
              :model-value="form.isBlocked === false"
              label="Unblocked users"
              hide-details
              @update:model-value="val => form.isBlocked = val ? false : null"
            />
          </v-col>

          <v-col cols="6">
            <v-checkbox
              :model-value="form.isBlocked === true"
              label="Blocked users"
              hide-details
              @update:model-value="val => form.isBlocked = val ? true : null"
            />
          </v-col>
        </v-row>

        <v-divider v-if="isAdmin" />

        <v-select
          v-if="isAdmin"
          v-model="form.loginRange"
          :items="loginOptions"
          label="Last login"
          clearable
          :disabled="customLoginRange"
        />

        <v-row v-if="isAdmin" dense>
          <v-col cols="6">
            <v-text-field
              v-model="form.loginFrom"
              type="date"
              label="Login from"
              clearable
              :disabled="!!form.loginRange"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="form.loginTo"
              type="date"
              label="Login to"
              clearable
              :disabled="!!form.loginRange"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">
          Cancel
        </v-btn>

        <v-btn
          variant="flat"
          color="clr0"
          :disabled="!hasFilters"
          @click="onSubmit"
        >
          Filter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
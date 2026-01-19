<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    title: String,
    submitLabel: String,
    showConfirm: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['submit']);

  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');

  function onSubmit() {
    const payload = {
      email: email.value,
      password: password.value,
    };

    if (props.showConfirm) {
      payload.confirmPassword = confirmPassword.value;
    }

    emit('submit', payload);

    email.value = '';
    password.value = '';
    confirmPassword.value = '';
  }
</script>

<template>
  <v-card width="380" class="pa-6 rounded-lg elevation-3">
    <v-card-title class="text-h6 text-center mb-2">
      {{ title }}
    </v-card-title>

    <v-card-text class="d-flex flex-column">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
      />

      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        autocomplete="current-password"
      />

      <v-text-field
        v-if="showConfirm"
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        autocomplete="new-password"
      />
    </v-card-text>

    <div class="mb-6 text-center">
      <slot />
    </div>

    <div class="d-flex justify-center">
      <v-btn
        variant="flat"
        color="clr0"
        class="btn-auth"
        :disabled="showConfirm && password !== confirmPassword"
        @click="onSubmit"
      >
        {{ submitLabel }}
      </v-btn>
    </div>

  </v-card>
</template>
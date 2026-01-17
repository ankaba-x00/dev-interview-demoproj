<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    title: String,
    submitLabel: String,
  });

  const emit = defineEmits(['submit']);

  const email = ref('');
  const password = ref('');

  function onSubmit() {
    emit('submit', {
      email: email.value,
      password: password.value,
    });
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
    </v-card-text>

    <div class="mb-6 text-center">
      <slot />
    </div>

    <div class="d-flex justify-center">
      <v-btn
        variant="flat"
        color="clr0"
        class="btn-auth"
        @click="onSubmit"
      >
        {{ submitLabel }}
      </v-btn>
    </div>

  </v-card>
</template>
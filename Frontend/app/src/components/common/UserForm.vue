<script setup>
  import { reactive, watch } from 'vue';
  import { nameRegex, emailRegex, locationRegex } from '@/utils/validators';

  const props = defineProps({
    modelValue: {
      type: Object,
      required: true,
    },
    placeholders: {
      type: Object,
      required: true,
    },
  });

  const form = reactive({ ...props.modelValue });

  const rules = {
    name: v =>
      !v ||
      nameRegex.test(v) ||
      'Enter full name (first and last name, letters only)',

    email: v =>
      !v ||
      emailRegex.test(v) ||
      'Enter a valid email address',

    location: v =>
      !v ||
      locationRegex.test(v) ||
      'Location may contain letters and hyphens only',
  };

  function sanitizeName(name) {
    return name?.trim().split(/\s+/).map(
        part =>
          part.charAt(0).toUpperCase() +
          part.slice(1).toLowerCase()
      ).join(' ');
  }

  function sanitizeEmail(email) {
    return email?.toLowerCase().trim();
  }

  function sanitizeLocation(location) {
    return location
      .trim()
      .toLowerCase()
      .split('-')
      .map(
        part =>
          part.charAt(0).toUpperCase() +
          part.slice(1)
      )
      .join('-');
  }

  watch(
    () => props.modelValue,
    v => Object.assign(form, v),
    { deep: true }
  );

  const emit = defineEmits(['submit']);

  function submit() {
    if (!form.name || !form.email) return;

    emit('submit', {
      ...form,
      name: sanitizeName(form.name),
      email: sanitizeEmail(form.email),
      location: sanitizeLocation(form.location),
    });
  }

  defineExpose({ submit });
</script>

<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="form.name"
      label="Name"
      :rules="[rules.name]"
      :placeholder="placeholders.name"
      required
    />

    <v-text-field
      v-model="form.email"
      label="Email"
      :rules="[rules.email]"
      :placeholder="placeholders.email"
      required
    />

    <v-text-field
      v-model="form.location"
      label="Location"
      :rules="[rules.location]"
      :placeholder="placeholders.location"
      required
    />

    <v-switch
      :model-value="form.status === 'active'"
      label="Active"
      color="success"
      base-color="grey"
      @update:modelValue="v => form.status = v ? 'active' : 'inactive'"
      required
    />

    <v-switch
      v-model="form.blocked"
      label="Blocked"
      color="error"
      base-color="grey"
      required
    />
  </v-form>
</template>

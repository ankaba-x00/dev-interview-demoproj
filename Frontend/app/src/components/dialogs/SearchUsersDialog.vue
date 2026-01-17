<script setup>
  import { reactive, computed, watch } from 'vue';
  import { nameSmRegex, emailSmRegex, locationRegex } from '@/utils/validators';

  const props = defineProps({
    modelValue: Boolean,
  });

  const form = reactive({
    name: '',
    email: '',
    location: '',
  });

  const rules = {
    name: v =>
      !v ||
      nameSmRegex.test(v) ||
      'Enter full name (letters only)',
    email: v =>
      !v ||
      emailSmRegex.test(v) ||
      'Invalid email format',
    location: v =>
      !v ||
      locationRegex.test(v) ||
      'Letters and hyphens only',
  };

  const isValid = computed(() =>
    rules.name(form.name) === true &&
    rules.email(form.email) === true &&
    rules.location(form.location) === true &&
    (form.name || form.email || form.location)
  );

  const emit = defineEmits(['update:modelValue', 'apply']);

  function close() {
    emit('update:modelValue', false);
  }

  function onSubmit() {
    if (!isValid.value) return;

    emit('apply', {
      name: form.name || undefined,
      email: form.email || undefined,
      location: form.location || undefined,
    })

    close();
  }

  watch(
    () => props.modelValue,
    open => {
      if (open) {
        form.name = '';
        form.email = '';
        form.location = '';
      }
    }
  );
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="480" persistent>
    <v-card class="pa-2 rounded-lg">
      <v-card-title class="text-h6">
        Search users
      </v-card-title>

      <v-card-text class="d-flex flex-column gap-4">
        <v-text-field
          v-model="form.name"
          label="Name"
          placeholder="e.g. Thomas Müller"
          :rules="[rules.name]"
          clearable
        />

        <v-text-field
          v-model="form.email"
          label="Email"
          placeholder="e.g. thomas@example.com"
          :rules="[rules.email]"
          clearable
        />

        <v-text-field
          v-model="form.location"
          label="Location"
          placeholder="e.g. Berlin"
          :rules="[rules.location]"
          clearable
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">
          Cancel
        </v-btn>

        <v-btn
          variant="flat"
          color="clr0"
          :disabled="!isValid"
          @click="onSubmit"
        >
          Search
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
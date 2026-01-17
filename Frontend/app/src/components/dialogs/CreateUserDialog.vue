<script setup>
  import { ref } from 'vue';
  import UserForm from '@/components/common/UserForm.vue';

  const props = defineProps({
    modelValue: Boolean,
  });

  const formRef = ref(null);

  const emptyUser = {
    name: '',
    email: '',
    location: '',
    status: 'active',
    blocked: false,
  };

  const emit = defineEmits(['update:modelValue', 'submit']);

  function close() {
    emit('update:modelValue', false);
  }

  function onSubmit(data) {
    emit('submit', data);
    close();
  }
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="500" persistent>
    <v-card class="pa-2 rounded-lg">
      <v-card-title>New user</v-card-title>

      <v-card-text>
        <UserForm
          ref="formRef"
          :model-value="emptyUser"
          :placeholders="{
            name: 'Max Mustermann',
            email: 'max@example.com',
            location: 'Berlin',
          }"
          @submit="onSubmit"
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn 
          variant="text" 
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="flat"
          color="clr0"
          @click="formRef?.submit()"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

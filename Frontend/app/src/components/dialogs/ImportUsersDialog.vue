<script setup>
  import { ref, computed } from 'vue';
  import Papa from 'papaparse';

  const props = defineProps({
    modelValue: Boolean,
  });

  const file = ref(null);
  const rows = ref([]);
  const headers = ref([]);
  const error = ref(null);

  function reset() {
    file.value = null;
    rows.value = [];
    headers.value = [];
    error.value = null;
  }

  const dialogWidth = computed(() =>
    rows.value.length ? 900 : 500
  )

  function onFileChange(selected) {
    if (!selected) return;

    if (!selected.name.endsWith('.csv')) {
      error.value = 'Only CSV files are allowed';
      return;
    }
    
    file.value = selected;

    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: result => {
        headers.value = result.meta.fields || [];
        rows.value = result.data.slice(0, 10);
        error.value = null;
      },
      error: err => {
        error.value = err.message;
      },
    });
  }

  const emit = defineEmits(['update:modelValue', 'submit']);

  function close() {
    emit('update:modelValue', false);
    reset();
  }

  function onSubmit() {
    if (!file.value) return;

    emit('submit', file.value);
    close();
  }
</script>

<template>
  <v-dialog 
    :model-value="modelValue" 
    :max-width="dialogWidth" 
    persistent
  >
    <v-card class="pa-2 rounded-lg">
      <v-card-title>Import users (CSV)</v-card-title>

      <v-card-text class="d-flex flex-column gap-4">
        <v-file-input
          v-model="file"
          label="Upload CSV file"
          accept=".csv"
          show-size
          @update:modelValue="onFileChange"
        />

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
        >
          {{ error }}
        </v-alert>

        <div v-if="rows.length">
          <div class="text-subtitle-3 mb-2">
            Preview (first {{ rows.length }} rows)
          </div>

          <v-table density="compact">
            <thead>
              <tr>
                <th v-for="h in headers" :key="h">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in rows" :key="i">
                <td v-for="h in headers" :key="h">
                  {{ row[h] }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="close">
          Cancel
        </v-btn>
        <v-btn
          variant="flat"
          color="clr0"
          :disabled="!file || error"
          @click="onSubmit"
        >
          Import
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

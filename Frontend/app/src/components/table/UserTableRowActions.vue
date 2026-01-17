<script setup>
  import { ref } from 'vue';
  import DeleteUserDialog from '@/components/dialogs/DeleteUserDialog.vue';
  import BlockUserDialog from '@/components/dialogs/BlockUserDialog.vue';
  import EditUserDialog from "../dialogs/EditUserDialog.vue";

  defineProps({
    user: {
      type: Object,
      required: true,
    },
  });

  const editDialogOpen = ref(false);
  const deleteDialogOpen = ref(false);
  const blockDialogOpen = ref(false);

  function editUser(id) {
    console.log('EDIT user', id);
  }

  function deleteUser(id) {
    console.log('DELETE user', id);
  }

  function blockUser(id) {
    console.log('BLOCK user', id);
  }
</script>

<template>
  <div class="d-flex gap-1">
    <v-tooltip text="Edit" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="editDialogOpen = true"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <EditUserDialog
      v-model="editDialogOpen"
      :user="user"
      @submit="editUser"
    />

    <v-tooltip text="Delete" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="deleteDialogOpen = true"
        >
          <v-icon color="error">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <DeleteUserDialog
      v-model="deleteDialogOpen"
      :user="user"
      @confirm="deleteUser"
    />

    <v-tooltip text="Block" location="top">
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="text"
          @click="blockDialogOpen = true"
        >
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <BlockUserDialog
      v-model="blockDialogOpen"
      :user="user"
      @confirm="blockUser"
    />
  </div>
</template>
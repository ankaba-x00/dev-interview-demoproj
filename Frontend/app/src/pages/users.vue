<script setup>
  import UserTableToolbar from '@/components/table/UserTableToolbar.vue';
  import UserTable from '@/components/table/UserTable.vue';
</script>

<template>
  <div class="ma-10 pa-4">
    <UserTableToolbar />

    <v-divider class="my-4" />

    <UserTable />
  </div>
</template>

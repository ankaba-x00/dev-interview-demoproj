<script setup>
  import { ref } from 'vue';
  import CopyIcon from '@/components/common/CopyIcon.vue';
  import UserTableRowActions from './UserTableRowActions.vue';
  import ExpandedRowContent from './ExpandedRowContent.vue';

  defineProps({
    filteredUsers: {
      type: Array,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    sortBy: {
      type: Array,
      default: () => [],
    }
  });

  const expanded = ref([]);

  const headers = [
    { title: 'ID', key: 'id', sortable: true, align: 'center', minWidth: 30, },
    { title: 'Name', key: 'name', sortable: true, align: 'center', minWidth: 175, },
    { title: 'Email', key: 'email', sortable: true, align: 'center', minWidth: 220, },
    { title: 'Location', key: 'location', sortable: true, align: 'center', minWidth: 120, },
    { title: 'Status', key: 'status', sortable: true, align: 'center', minWidth: 70, },
    { title: 'Blocked', key: 'blocked', sortable: true, align: 'center', minWidth: 70, },
    { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: 80, },
  ];

  const emit = defineEmits(['update:sort-by']);
</script>

<template>
  <v-data-table
    aria-label="Users data table with expandable rows for admins"
    v-model:expanded="expanded"
    :sort-by="sortBy"
    @update:sort-by="emit('update:sort-by', $event)"
    :show-expand="isAdmin"
    :headers="headers"
    :items="filteredUsers"
    item-value="id"
    fixed-header
    height="525"
    class="elevation-1 bg-background rounded-lg"
  >
    <template #item.name="{ value }">
      <div class="d-flex align-center justify-center gap-2">
        <span>{{ value }}</span>
        <CopyIcon :value="value" />
      </div>
    </template>

    <template #item.email="{ value }">
      <div class="d-flex align-center justify-center gap-2">
        <span>{{ value }}</span>
        <CopyIcon :value="value" />
      </div>
    </template>

    <template #item.actions="{ internalItem }">
      <div class="d-flex justify-center">
        <UserTableRowActions 
          :user="internalItem.raw"
          aria-label="User action menu"
        />
      </div>
    </template>
    
    <template #expanded-row="{ columns, internalItem }">
      <tr>
        <td :colspan="columns.length">
          <ExpandedRowContent
            :user="internalItem.raw"
            :is-admin="isAdmin"
            aria-label="Admin expandable row section"
          />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style scoped lang="scss">
  // .table-90 {
  //   max-width: 90%;
  //   margin-left: auto;
  //   margin-right: auto;
  // }

  // :deep(.v-table__wrapper > table th),
  // :deep(.v-table__wrapper > table td) {
  //   border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  // }

  // :deep(.v-table__wrapper > table th:last-child),
  // :deep(.v-table__wrapper > table td:last-child) {
  //   border-right: none;
  // }

  :deep(.v-table__wrapper > table thead th) {
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
  }

  :deep(.v-data-table-header__content) {
    justify-content: center;
    gap: 5px;

    &:hover > * {
      opacity: 1 !important;
      transform: scale(1.1) !important;
    }
  }

  :deep(.v-data-table-header__sort-icon) {
    opacity: 0.35 !important;
    visibility: visible !important;
  }
</style>
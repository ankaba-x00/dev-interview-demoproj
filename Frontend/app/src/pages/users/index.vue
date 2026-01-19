<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import UserTableToolbar from '@/components/table/UserTableToolbar.vue';
  import UserTable from '@/components/table/UserTable.vue';
  import UserTableExportFooter from "@/components/table/UserTableExportFooter.vue";
  import CreateUserDialog from "@/components/dialogs/CreateUserDialog.vue";
  import ImportUsersDialog from "@/components/dialogs/ImportUsersDialog.vue";
  import SearchUsersDialog from '@/components/dialogs/SearchUsersDialog.vue';
  import FilterUsersDialog from '@/components/dialogs/FilterUsersDialog.vue';
  import EditUserDialog from "@/components/dialogs/EditUserDialog.vue";
  import DeleteUserDialog from "@/components/dialogs/DeleteUserDialog.vue";
  import BlockUserDialog from "@/components/dialogs/BlockUserDialog.vue";
  import ExportUsersDialog from "@/components/dialogs/ExportUsersDialog.vue";
  //import userData from '@/users.json';
  import api from "@/api/axios";
  import { useAuthStore } from "@/stores/auth";
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import { useNotificationStore } from '@/stores/notifications';

  definePage({
    meta: {
      requiresAuth: true,
    },
  });

  const auth = useAuthStore();
  const isAdmin = computed(() => auth.isAdmin);

  const state = reactive({
    users: [],
    isLoading: true,
  });

  const users = computed(() =>
    state.users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      blocked: user.isBlocked,
      status: user.isActive ? 'active' : 'inactive',
      lastLogin: user.lastLogin,
      ipAddress: user.ipAddress,
    }))
  );

  const createDialogOpen = ref(false);
  const importDialogOpen = ref(false);
  const searchDialogOpen = ref(false);
  const filterDialogOpen = ref(false);
  const exportDialogOpen = ref(false);

  const route = useRoute();
  const router = useRouter();
  const notify = useNotificationStore();

  // QUERY PARAMS

  const userId = computed(() => route.query.id);
  const action = computed(() => route.query.action);

  const searchParams = computed(() => ({
    name: route.query.name?.toString().toLowerCase() || '',
    email: route.query.email?.toString().toLowerCase() || '',
    location: route.query.location?.toString().toLowerCase() || '',
  }));

  const filterParams = computed(() => ({
    isActive:
      route.query.isActive === 'true'
        ? true
        : route.query.isActive === 'false'
          ? false
          : null,
    isBlocked:
      route.query.isBlocked === 'true'
        ? true
        : route.query.isBlocked === 'false'
          ? false
          : null,
    loginRange: route.query.loginRange || null,
    loginFrom: route.query.loginFrom || null,
    loginTo: route.query.loginTo || null,
  }));

  const sortParams = computed(() => {
    if (!route.query.sortBy || !route.query.order) return [];

    return [
      {
        key: route.query.sortBy,
        order: route.query.order === 'desc' ? 'desc' : 'asc',
      },
    ];
  });

  const paginationParams = computed(() => ({
      page: Number(route.query.page) || 1,
      limit: Number(route.query.limit) || 25,
  }));

  // MODIFYING

  const selectedUser = computed(() =>
    users.value.find(u => String(u.id) === String(userId.value))
  );

  const isEditOpen = computed(() => !!userId.value && action.value === 'edit');
  const isDeleteOpen = computed(() => !!userId.value && action.value === 'delete');
  const isBlockOpen = computed(() => !!userId.value && action.value === 'block');

  function closeDialogs() {
    const { action, id, ...tableQuery } = route.query;
    router.push({ 
      path: '/users',
      query: tableQuery,
    });
  }

  // HELPER

  function withinLoginRange(lastLogin, range) {
    if (!range || !lastLogin) return true;

    const now = Date.now();
    const loginTime = new Date(lastLogin).getTime();

    const ranges = {
      '24h': 24 * 60 * 60 * 1000,
      '3d': 3 * 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
      '4w': 28 * 24 * 60 * 60 * 1000,
    };

    return now - loginTime <= ranges[range];
  }

  function withinCustomRange(lastLogin, from, to) {
    if (!lastLogin) return false;

    const time = new Date(lastLogin).getTime();
    if (from && time < new Date(from).getTime()) return false;
    if (to && time > new Date(to).getTime() + 86400000) return false;

    return true;
  }

  // FILTERING

  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      // SEARCH
      if (
        searchParams.value.name &&
        !user.name.toLowerCase().includes(searchParams.value.name)
      ) return false;

      if (
        searchParams.value.email &&
        !user.email.toLowerCase().includes(searchParams.value.email)
      ) return false;

      if (
        searchParams.value.location &&
        !user.location.toLowerCase().includes(searchParams.value.location)
      ) return false;

      // FILTERS
      if (filterParams.value.isActive !== null) {
        const isUserActive = user.status === 'active'
        if (isUserActive !== filterParams.value.isActive) return false;
      }

      if (filterParams.value.isBlocked !== null) {
        if (user.blocked !== filterParams.value.isBlocked) return false;
      }

      if (isAdmin.value) {
        if (filterParams.value.loginFrom || filterParams.value.loginTo) {
          if (
            !withinCustomRange(
              user.lastLogin,
              filterParams.value.loginFrom,
              filterParams.value.loginTo,
            )
          ) return false;
        } else if (
          filterParams.value.loginRange &&
          !withinLoginRange(user.lastLogin, filterParams.value.loginRange)
        ) {
          return false;
        }
      }
      return true;
    })
  });

  // SORTING

  const sortedUsers = computed(() => {
    const rows = [...filteredUsers.value];

    const sortBy = route.query.sortBy;
    const order = route.query.order;

    if (!sortBy || !['asc', 'desc'].includes(order)) return rows;

    rows.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (aVal < bVal) return order === 'desc' ? 1 : -1;
      if (aVal > bVal) return order === 'desc' ? -1 : 1;
      return 0;
    });

    return rows;
  });

  // HANDLE QUERY UPDATES

  function applySearch(params) {
    const current = { ...route.query };

    if (params.name) current.name = params.name;
    else delete current.name;

    if (params.email) current.email = params.email;
    else delete current.email;

    if (params.location) current.location = params.location;
    else delete current.location;

    router.push({ query: current });
  }

  function applyFilters(params) {
    const current = { ...route.query };

    if (params.isActive !== undefined) {
      current.isActive = String(params.isActive);
    } else {
      delete current.isActive;
    }

    if (params.isBlocked !== undefined) {
      current.isBlocked = String(params.isBlocked);
    } else {
      delete current.isBlocked;
    }

    if (params.loginRange) {
      current.loginRange = params.loginRange;
      delete current.loginFrom;
      delete current.loginTo;
    } else {
      delete current.loginRange;
    }

    if (params.loginFrom || params.loginTo) {
      if (params.loginFrom) current.loginFrom = params.loginFrom
      else delete current.loginFrom;

      if (params.loginTo) current.loginTo = params.loginTo
      else delete current.loginTo;

      delete current.loginRange;
    }

    router.push({ query: current });
  }

  function applySort(params) {
    const current = { ...route.query };
    
    if (!params.length) {
      delete current.sortBy;
      delete current.order;
    } else {
      current.sortBy = params[0].key;
      current.order = params[0].order;
    }

    router.push({ query: current });
  }

  function applyPagination({ page, itemsPerPage }) {
    const current = { ...route.query };

    current.page = page;
    current.limit = itemsPerPage;

    router.push({ query: current });
  }

  // FETCH USERS

  async function fetchUsers() {
    state.isLoading = true;
    try {
      const response = await api.get('/users', {
        params: {
          ...route.query,
          page: paginationParams.value.page,
          limit: paginationParams.value.limit,
        },
      });
      state.users = response.data.data;
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      state.isLoading = false;
    }
  }

  // HANDLE IMPORT

  async function createUser(data) {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        location: data.location,
        isActive: data.status === 'active',
        isBlocked: !!data.blocked,
      };
      await api.post('/users', payload);
      await fetchUsers();
      createDialogOpen.value = false;
    } catch (err) {
      console.error('Failed to create user', err);
    }
  }

async function importUsers(file) {
  if (!file) {
    console.warn("No file selected for import")
    return;
  }
  try {
    const formData = new FormData();
    formData.append("file", file);
    await api.post("/data/import", formData);
    notify.success('Import successful');
    await fetchUsers();
  } catch (err) {
    console.error('Failed to import file', err);
  }
}

  // HANDLE MODIFICATION

  async function updateUser(data) {
    console.log(data)
    try {
      if (!data?.id) {
        throw new Error("User ID missing");
      }
      const payload = {
        name: data.name,
        email: data.email,
        location: data.location,
        isActive: data.status === "active",
        isBlocked: !!data.blocked,
      };
      await api.patch(`/users/${data.id}`, payload);
      await fetchUsers();
      closeDialogs();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  }

  async function deleteUser(user) {
    try {
      if (!user?.id) {
        throw new Error("User ID missing");
      }
      await api.delete(`/users/${user.id}`);
      await fetchUsers();
      closeDialogs();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  }

  async function blockUser(user) {
    try {
      if (!user?.id) {
        throw new Error("User ID missing");
      }
      const endpoint = user.blocked
        ? `/users/${user.id}/unblock`
        : `/users/${user.id}/block`;
      await api.patch(endpoint);
      await fetchUsers();
      closeDialogs();
    } catch (err) {
      console.error("Failed to block/unblock user", err);
    }
  }

  // HANDLE EXPORT

  async function downloadCSV(params) {
    const response = await api.get("/data/export", {
      params,
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  async function exportFullList() {
    try {
      await downloadCSV({});
      notify.success('Full export successful');
    } catch (err) {
      console.error("Failed to export full list", err);
    }
  }

  async function exportClientList() {
    try {
      const { action, id, page, limit, ...filters } = route.query;
      await downloadCSV(filters);
      notify.success('Filtered export successful');
    } catch (err) {
      console.error("Failed to export filtered list", err);
    }
  }

  onMounted(fetchUsers);
</script>

<template>
  <div class="ma-8 pa-4">

    <!-- STATIC PAGE CONTENT -->

    <UserTableToolbar
      @create="createDialogOpen = true"
      @import="importDialogOpen = true"
      @search="searchDialogOpen = true"
      @filter="filterDialogOpen = true"
    />

    <v-divider class="my-2" />

    <PulseLoader v-if="state.isLoading" class="ma-16"/>
    <UserTable 
      v-else
      :items="sortedUsers"
      :sort-by="sortParams"
      :page="paginationParams.page"
      :items-per-page="paginationParams.limit"
      :total-items="sortedUsers.length"
      @update:sort-by="applySort"
      @update:pagination="applyPagination"
    />

    <v-divider class="my-2" />

    <UserTableExportFooter
      :filtered-users="sortedUsers"
      @export="exportDialogOpen = true"
    />

    <!-- DYNAMIC PAGE CONTENT -->

    <CreateUserDialog
      v-model="createDialogOpen"
      @submit="createUser"
    />

    <ImportUsersDialog 
      v-model="importDialogOpen"
      @submit="importUsers"
    />

    <SearchUsersDialog
      v-model="searchDialogOpen"
      @apply="applySearch"
    />

    <FilterUsersDialog
      v-model="filterDialogOpen"
      @apply="applyFilters"
    />

    <EditUserDialog
      v-if="selectedUser"
      :model-value="isEditOpen"
      :user="selectedUser"
      @update:modelValue="v => !v && closeDialogs()"
      @submit="updateUser"
    />

    <DeleteUserDialog
      v-if="selectedUser"
      :model-value="isDeleteOpen"
      :user="selectedUser"
      @update:modelValue="v => !v && closeDialogs()"
      @confirm="deleteUser"
    />

    <BlockUserDialog
      v-if="selectedUser"
      :model-value="isBlockOpen"
      :user="selectedUser"
      @update:modelValue="v => !v && closeDialogs()"
      @confirm="blockUser"
    />

    <ExportUsersDialog
      v-model="exportDialogOpen"
      @export-full="exportFullList"
      @export-filtered="() => exportClientList(sortedUsers)"
    />

  </div>
</template>

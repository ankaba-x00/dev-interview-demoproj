<script setup>
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import UserTableToolbar from '@/components/table/UserTableToolbar.vue';
  import UserTable from '@/components/table/UserTable.vue';
  import UserTableExportFooter from "@/components/table/UserTableExportFooter.vue";
  import CreateUserDialog from "@/components/dialogs/CreateUserDialog.vue";
  import ImportUsersDialog from "@/components/dialogs/ImportUsersDialog.vue";
  import SearchUsersDialog from '@/components/dialogs/SearchUsersDialog.vue';
  import FilterUsersDialog from '@/components/dialogs/FilterUsersDialog.vue';
  import ExportUsersDialog from "@/components/dialogs/ExportUsersDialog.vue";
  import userData from '@/users.json';

  const isAdmin = ref(true);

  const createDialogOpen = ref(false);
  const importDialogOpen = ref(false);
  const searchDialogOpen = ref(false);
  const filterDialogOpen = ref(false);
  const exportDialogOpen = ref(false);
  
  const users = ref(
    userData.map((user, index) => ({
      id: index + 1,
      name: user.Name,
      email: user.Email,
      location: user.Location,
      blocked: user.Active !== 'true',
      status: user.Active === 'true' ? 'active' : 'inactive',
      lastLogin: user.LastLogin,
      ipAddress: user.IPAddress,
    }))
  );

  const route = useRoute();
  const router = useRouter();

  // QUERY PARAMS

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

    if (!sortBy) return rows;

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

  function createUser(data) {
    console.log('CREATE user', data);
  }

  function importUsers(file) {
    console.log('IMPORT users', file);
  }

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

  function exportFullList() {
    console.log('EXPORT full list from backend');
  }

  function exportClientList(rows) {
    console.log('EXPORT filtered list', rows);
  }
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

    <UserTable 
      :filtered-users="sortedUsers"
      :is-admin="isAdmin"
      :sort-by="sortParams"
      @update:sort-by="applySort"
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
      :is-admin="isAdmin"
      @apply="applyFilters"
    />

    <ExportUsersDialog
      v-model="exportDialogOpen"
      @export-full="exportFullList"
      @export-filtered="() => exportClientList(sortedUsers)"
    />

  </div>
</template>

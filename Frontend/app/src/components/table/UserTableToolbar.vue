<script setup>
  defineEmits(['create','import','search', 'filter']);
</script>

<template>
  <v-row dense>
    <v-col cols="0" md="4" class="d-none d-md-block d-xl-none" />
    <v-col cols="0" md="4" class="d-none d-md-block d-xl-none" />

    <v-col
      cols="6"
      md="4"
      xl="3"
      order="1"
      order-md="1"
      order-xl="4"
    >
      <v-btn 
        block 
        color="clr0" 
        prepend-icon="mdi-plus"
        @click="$emit('create')"
      >
        New User
      </v-btn>
    </v-col>

    <v-col
      cols="6"
      md="4"
      xl="3"
      order="2"
      order-md="4"
      order-xl="3"
    >
      <v-btn 
        block 
        variant="outlined" 
        prepend-icon="mdi-file-upload"
        @click="$emit('import')"
      >
        Import
      </v-btn>
    </v-col>

    <v-col
      cols="6"
      md="4"
      xl="3"
      order="3"
      order-md="2"
      order-xl="1"
    >
      <v-btn 
        block 
        variant="outlined" 
        prepend-icon="mdi-magnify"
        @click="$emit('search')"
      >
        Search
      </v-btn>
    </v-col>

    <v-col
      cols="6"
      md="4"
      xl="3"
      order="4"
      order-md="3"
      order-xl="2"
    >
      <v-btn 
        block 
        variant="outlined" 
        prepend-icon="mdi-filter-variant"
        @click="$emit('filter')"
      >
        Filter
      </v-btn>
    </v-col>
  </v-row>
</template>

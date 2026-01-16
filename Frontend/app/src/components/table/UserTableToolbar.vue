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
      <v-btn block color="clr0" prepend-icon="mdi-plus">
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
      <v-btn block variant="outlined" prepend-icon="mdi-file-upload">
        Log List
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
      <v-btn block variant="outlined" prepend-icon="mdi-magnify">
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
      <v-btn block variant="outlined" prepend-icon="mdi-filter-variant">
        Filter
      </v-btn>
    </v-col>
  </v-row>
</template>

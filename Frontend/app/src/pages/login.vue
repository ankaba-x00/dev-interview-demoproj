<script setup>
  import AuthForm from '@/components/common/AuthForm.vue';

  definePage({
    meta: {
      layout: 'auth',
    },
  });

  function login(data) {
    console.log('LOGIN', data);
  }
</script>

<template>
  <AuthForm
    title="Login"
    submit-label="Login"
    @submit="login"
  >
    <span class="text-caption">
      Not registered yet?
      <RouterLink 
        to="/register" 
        class="auth-link"
      >
        Register here
      </RouterLink>
    </span>
  </AuthForm>
</template>
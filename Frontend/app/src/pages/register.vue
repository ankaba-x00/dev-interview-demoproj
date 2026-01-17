<script setup>
  import AuthForm from '@/components/common/AuthForm.vue';

  definePage({
    meta: {
      layout: 'auth',
    },
  });

  function register(data) {
    console.log('REGISTER', data);
  }
</script>

<template>
  <AuthForm
    title="Register"
    submit-label="Create account"
    @submit="register"
  >
    <span class="text-caption">
      Already registered?
      <RouterLink 
        to="/login" 
        class="auth-link"
      >
        Login here
      </RouterLink>
    </span>
  </AuthForm>
</template>

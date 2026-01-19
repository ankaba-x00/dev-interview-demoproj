<script setup>
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import AuthForm from '@/components/common/AuthForm.vue';

  definePage({
    meta: {
      layout: 'auth',
    },
  });

  const auth = useAuthStore();
  const router = useRouter();

  async function login(data) {
    try {
      await auth.login(data);
      router.push('/');
    } catch (err) {
      console.error('Login failed', err);
    }
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
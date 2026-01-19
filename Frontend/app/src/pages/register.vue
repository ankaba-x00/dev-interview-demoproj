<script setup>
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import AuthForm from '@/components/common/AuthForm.vue';
  import { useNotificationStore } from '@/stores/notifications';

  definePage({
    meta: {
      layout: 'auth',
    },
  });

  const auth = useAuthStore();
  const router = useRouter();
  const notify = useNotificationStore();

  async function register(data) {
    try {
      await auth.register(data);
      notify.success('Account created successfully');
      router.push('/login');
    } catch (err) {
      console.log(err.details);
      console.error('Register failed', err);
    }
  }
</script>

<template>
  <AuthForm
    title="Register"
    submit-label="Create"
    :show-confirm="true"
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

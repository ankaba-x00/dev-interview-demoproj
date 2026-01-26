import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';

/*
Tests:
1) Redirects authenticated user away from login page
*/

describe('Authenticated redirect', () => {
  beforeEach(async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        user: { id: '1', role: 'USER' },
        accessToken: 'token',
      })
    );

    router.push('/');
    await router.isReady();
  });

  it('redirects authenticated user away from login page', async () => {
    mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    await router.push('/login');
    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/');
  });
});
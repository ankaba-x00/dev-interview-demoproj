import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import router from '@/router';

/*
Tests:
1) Redirects unauthenticated user to /login
*/

describe('Protected route redirect', () => {
  beforeEach(async () => {
    localStorage.clear();

    router.push('/users');
    await router.isReady();
  });

  it('redirects unauthenticated user to /login', async () => {
    mount(App, {
      global: {
        plugins: [createPinia(), router],
      },
    });

    await router.isReady();

    expect(router.currentRoute.value.path).toBe('/login');
  });
});

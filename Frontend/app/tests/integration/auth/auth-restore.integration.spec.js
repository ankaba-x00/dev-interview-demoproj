import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import App from '@/App.vue';

/*
Tests: 
1) Restores authenticated user from localStorage on app load
*/

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
    }),
    useRoute: () => ({
      meta: {},
    }),
  };
});

describe('Auth restore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('restores authenticated user from localStorage on app load', async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        user: {
          id: '1',
          email: 'test@test.de',
          role: 'USER',
        },
        accessToken: 'token123',
      })
    );

    const pinia = createPinia();

    mount(App, {
      global: {
        plugins: [pinia],
      },
    });

    const auth = useAuthStore();
    auth.restore();
    
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.user).toEqual({
      id: '1',
      email: 'test@test.de',
      role: 'USER',
    });
  });
});
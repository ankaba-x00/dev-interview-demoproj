import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createPinia } from 'pinia';
import UsersPage from '@/pages/users/index.vue';

/*
Tests: 
1) Hides admin-only UI for non-admin users
*/

vi.mock('@/api/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: { data: [] },
    }),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Users page admin visibility', () => {
  it('hides admin-only UI for non-admin users', async () => {
    const pinia = createPinia();

    const { useAuthStore } = await import('@/stores/auth');
    const auth = useAuthStore(pinia);
    auth.user = { role: 'USER' };
    auth.isAuthenticated = true;

    const wrapper = mount(UsersPage, {
      global: {
        plugins: [pinia],
      },
    });

    await flushPromises();

    expect(wrapper.text()).not.toContain('Export');
    expect(wrapper.text()).not.toContain('Block user');
  });
});

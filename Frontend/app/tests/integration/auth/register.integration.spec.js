
import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createAuthFormStub } from '../utils';
import api from '@/api/axios';

/*
Tests:
1) Registers user and redirects on success
2) Does not redirect when register fails
*/

vi.mock('@/api/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

const pushMock = vi.fn();

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual, // createRouter, createWebHistory, etc.
    useRouter: () => ({
      push: pushMock,
    }),
  };
});

import Register from '@/pages/register.vue';

const AuthFormStub = createAuthFormStub({
  email: 'test@test.de',
  password: 'secret',
  confirmPassword: 'secret',
});

function mountRegister() {
  const pinia = createPinia();
  setActivePinia(pinia);

  return mount(Register, {
    global: {
      plugins: [pinia],
      stubs: {
        AuthForm: AuthFormStub,
        RouterLink: {
          template: `<a><slot /></a>`,
        },
      },
    },
  });
}

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers user and redirects on success', async () => {
    api.post.mockResolvedValueOnce({});

    const wrapper = mountRegister();

    await wrapper.find('[data-test="submit"]').trigger('click');
    await flushPromises();

    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      email: 'test@test.de',
      password: 'secret',
      confirmPassword: 'secret',
    });

    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('does not redirect when register fails', async () => {
    api.post.mockRejectedValueOnce(new Error('Register failed'));

    const wrapper = mountRegister();

    await wrapper.find('[data-test="submit"]').trigger('click');
    await flushPromises();

    expect(pushMock).not.toHaveBeenCalled();
  });
});

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createAuthFormStub } from '../utils';
import api from '@/api/axios';
import { flushPromises } from '@vue/test-utils';

/*
Tests:
1) Logs in and redirects on success
2) Does not redirect when login fails
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

import LoginPage from '@/pages/login.vue';

const AuthFormStub = createAuthFormStub({
  email: 'test@test.de',
  password: 'secret',
});

function mountLogin() {
  const pinia = createPinia();
  setActivePinia(pinia);

  return mount(LoginPage, {
    global: {
      plugins: [pinia],
      stubs: {
        AuthForm: AuthFormStub,
        RouterLink: true,
      },
    },
  });
}

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in and redirects on success', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: '1',
        email: 'test@test.de',
        role: 'USER',
        accessToken: 'token',
      },
    });

    const wrapper = mountLogin();

    await wrapper.find('[data-test="submit"]').trigger('click');
    await flushPromises();

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.de',
      password: 'secret',
    });

    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('does not redirect when login fails', async () => {
    api.post.mockRejectedValueOnce(new Error('fail'));

    const wrapper = mountLogin();

    await wrapper.find('[data-test="submit"]').trigger('click');
    await flushPromises();

    expect(pushMock).not.toHaveBeenCalled();
  });
});
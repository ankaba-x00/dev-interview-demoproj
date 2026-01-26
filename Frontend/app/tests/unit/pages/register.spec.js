import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

/*
Tests:
1) Registers user and redirects on success
2) Does not redirect when register fails
*/

const registerMock = vi.fn();
const successMock = vi.fn();
const pushMock = vi.fn();

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    register: registerMock,
  }),
}));

vi.mock('@/stores/notifications', () => ({
  useNotificationStore: () => ({
    success: successMock,
  }),
}));

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

import Register from '@/pages/register.vue';

const AuthFormStub = {
  emits: ['submit'],
  template: `<button data-test="submit" @click="$emit('submit', payload)" />`,
  data() {
    return {
      payload: {
        email: 'test@test.de',
        password: 'secret',
        confirmPassword: 'secret',
      },
    };
  },
};

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers user and redirects on success', async () => {
    registerMock.mockResolvedValueOnce();

    const wrapper = mount(Register, {
      global: {
        stubs: {
          AuthForm: AuthFormStub,
          RouterLink: true,
        },
      },
    });

    await wrapper.find('[data-test="submit"]').trigger('click');

    expect(registerMock).toHaveBeenCalledWith({
      email: 'test@test.de',
      password: 'secret',
      confirmPassword: 'secret',
    });
    expect(successMock).toHaveBeenCalledWith('Account created successfully');
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  it('does not redirect when register fails', async () => {
    registerMock.mockRejectedValueOnce(new Error('fail'));

    const wrapper = mount(Register, {
      global: {
        stubs: {
          AuthForm: AuthFormStub,
          RouterLink: true,
        },
      },
    });

    await wrapper.find('[data-test="submit"]').trigger('click');

    expect(pushMock).not.toHaveBeenCalled();
  });
});

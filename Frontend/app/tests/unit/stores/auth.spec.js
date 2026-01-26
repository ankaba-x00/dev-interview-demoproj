import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

/*
Tests:
1) Logs in and sets user state
2) Returns true for isAdmin when role is ADMIN
3) Restores state from localStorage
4) Logs out and clears state
5) Throws error if login API fails
6) Throws error if register API fails
*/

vi.mock('@/api/axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('logs in and sets user state', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: '1',
        email: 'test@test.de',
        role: 'ADMIN',
        accessToken: 'token123',
      },
    });

    const store = useAuthStore();

    await store.login({ email: 'test@test.de', password: 'secret' });

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.de',
      password: 'secret',
    });

    expect(store.user).toEqual({
      id: '1',
      email: 'test@test.de',
      role: 'ADMIN',
    });
    expect(store.token).toBe('token123');
    expect(store.isAuthenticated).toBe(true);
  });

  it('returns true for isAdmin when role is ADMIN', () => {
    const store = useAuthStore();
    store.user = { role: 'ADMIN' };

    expect(store.isAdmin).toBe(true);
  });

  it('restores state from localStorage', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({
        user: { id: '1', role: 'USER' },
        accessToken: 'abc',
      })
    );

    const store = useAuthStore();
    store.restore();

    expect(store.user).toEqual({ id: '1', role: 'USER' });
    expect(store.token).toBe('abc');
    expect(store.isAuthenticated).toBe(true);
  });

  it('logs out and clears state', () => {
    const store = useAuthStore();
    store.user = { id: '1' };
    store.token = 'token';
    store.isAuthenticated = true;

    store.logout();

    expect(store.user).toBe(null);
    expect(store.token).toBe(null);
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('throws error if login API fails', async () => {
    api.post.mockRejectedValueOnce(new Error('fail'));

    const store = useAuthStore();

    await expect(
      store.login({ email: 'test@test.de', password: 'secret' })
    ).rejects.toThrow();
  });

  it('throws error if register API fails', async () => {
    api.post.mockRejectedValueOnce(new Error('fail'));

    const store = useAuthStore();

    await expect(
      store.register({ email: 'a' })
    ).rejects.toThrow();
  });
});

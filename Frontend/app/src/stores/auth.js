import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    async login(credentials) {
      const res = await api.post('/auth/login', credentials);

      this.user = {
        id: res.data.id,
        email: res.data.email,
        role: res.data.role,
      };

      this.token = res.data.accessToken;
      this.isAuthenticated = true;

      localStorage.setItem(
        'user',
        JSON.stringify({
          user: this.user,
          accessToken: this.token,
        })
      );
    },

    async register(payload) {
      await api.post('/auth/register', payload);
    },

    restore() {
      const saved = localStorage.getItem('user');
      if (!saved) return;

      const parsed = JSON.parse(saved);
      this.user = parsed.user;
      this.token = parsed.accessToken;
      this.isAuthenticated = true;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    show: false,
    message: '',
    color: 'info', // success | error | warning | info
    timeout: 4000,
  }),

  actions: {
    notify(message, color = 'info', timeout = 4000) {
      this.message = message;
      this.color = color;
      this.timeout = timeout;
      this.show = true;
    },

    success(message) {
      this.notify(message, 'success');
    },

    error(message) {
      this.notify(message, 'error');
    },

    warning(message) {
      this.notify(message, 'warning');
    },
  },
});

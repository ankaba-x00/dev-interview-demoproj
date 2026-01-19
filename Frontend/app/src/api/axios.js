import axios from 'axios';
import { useNotificationStore } from '@/stores/notifications';
import router from '@/router';

const api = axios.create({
  baseURL: 'http://localhost:4001/v1',
});

api.interceptors.request.use(
  (config) => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {}

    if (user?.accessToken) {
      config.headers.token = `Bearer ${user.accessToken}`;
    }

    config.headers["x-frontend"] = "client";
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const notifications = useNotificationStore();

    if (!error.response) {
      notifications.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        notifications.error(
          Array.isArray(data)
            ? data[0]?.message || 'Invalid request'
            : data?.message || 'Invalid request'
        );
        break;

      case 401:
        notifications.error('Invalid email or password');
        localStorage.removeItem('user');
        router.push('/login');
        break;

      case 403:
        notifications.error(data?.message || 'Access denied');
        break;

      case 404:
        notifications.error(data?.message || 'Resource not found');
        break;

      case 409:
        notifications.warning(data?.message || 'Conflict detected');
        break;

      default:
        if (status >= 500) {
          notifications.error('Server error. Please try again later.');
        } else if (data?.message) {
          notifications.error(data.message);
        } else {
          notifications.error('Unexpected error occurred');
        }
    }
    return Promise.reject(error);
  }
);

export default api;

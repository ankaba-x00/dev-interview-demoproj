import { registerPlugins } from '@/plugins';
import { createApp } from 'vue';
import { useAuthStore } from '@/stores/auth';
import App from './App.vue';

import '@/styles/base.scss';
import '@/styles/utilities.scss';
import '@/styles/components.scss';

const app = createApp(App);

registerPlugins(app);

const auth = useAuthStore();
auth.restore();
app.mount('#app');
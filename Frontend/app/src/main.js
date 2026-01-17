import { registerPlugins } from '@/plugins';
import { createApp } from 'vue';
import App from './App.vue';

import '@/styles/base.scss';
import '@/styles/utilities.scss';
import '@/styles/components.scss';

const app = createApp(App);

registerPlugins(app);

app.mount('#app');
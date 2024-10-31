import './scss/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { Dashboard, DashboardKey } from './services/dashboard';

createApp(App)
  .provide(DashboardKey, new Dashboard(import.meta.env.VITE_API_HOST))
  .mount('#app');

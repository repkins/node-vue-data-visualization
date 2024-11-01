import './scss/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { Dashboard, DashboardKey } from './services/dashboard';

const ApiHost = import.meta.env.VITE_API_HOST ?? 'localhost:8080';

createApp(App)
  .provide(DashboardKey, new Dashboard(ApiHost))
  .mount('#app');

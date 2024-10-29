import './scss/styles.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { ApiHostKey } from './keys';

createApp(App)
    .provide(ApiHostKey, import.meta.env.VITE_API_HOST)
    .mount('#app');

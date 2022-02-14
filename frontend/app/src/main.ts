import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/tailwind.css';

const app = createApp(App).use(router);
const pinia = createPinia();
app.use(pinia);
app.mount('#app');

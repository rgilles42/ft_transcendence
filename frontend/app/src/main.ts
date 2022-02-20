import { createApp } from 'vue';
import { createPinia } from 'pinia';
import FloatingVue from 'floating-vue';
import App from './App.vue';
import router from './router';
import './assets/css/app.scss';

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(FloatingVue);
app.mount('#app');

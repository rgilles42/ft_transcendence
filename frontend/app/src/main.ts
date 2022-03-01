import { createApp } from 'vue';
import { createPinia } from 'pinia';
import FloatingVue from 'floating-vue';
import Datepicker from 'vue3-date-time-picker';
import App from './App.vue';
import router from './router';
import 'vue3-date-time-picker/dist/main.css';
import './assets/css/app.scss';

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(FloatingVue);
app.component('Datepicker', Datepicker);
app.mount('#app');

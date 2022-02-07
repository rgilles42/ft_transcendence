import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';

const app = createApp(App).use(router);
const api = axios.create({
  baseURL: process.env.API_URL,
});
app.use(VueAxios, api);
app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');

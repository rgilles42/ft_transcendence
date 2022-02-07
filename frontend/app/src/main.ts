import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';

const app = createApp(App).use(router);
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});
app.use(VueAxios, api);
app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');

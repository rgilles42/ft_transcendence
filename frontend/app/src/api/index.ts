import axios from 'axios';

import Users from './users';
import Auth from './auth';

const $axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

const repositories = {
  auth: Auth($axios),
  users: Users($axios),
};

export default repositories;

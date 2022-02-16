import axios from 'axios';

import Auth from './auth';
import Users from './users';
import Channels from './channels';
import Games from './games';

const $axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: ['production', 'prod'].includes(process.env.NODE_ENV),
});

const repositories = {
  auth: Auth($axios),
  users: Users($axios),
  channels: Channels($axios),
  games: Games($axios),
};

export default repositories;

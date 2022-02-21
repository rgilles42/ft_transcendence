import axios from 'axios';

import Auth from './auth';
import Users from './users';
import Channels from './channels';
import Games from './games';

export const $axios = axios.create({
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
  channels: Channels($axios),
  games: Games($axios),
};

export default repositories;

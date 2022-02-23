/* eslint-disable import/no-cycle */
import axios from 'axios';

import setupInterceptors from '@/services/setupInterceptors';
import { configService } from '@/services/configService';
import Auth from './auth';
import Users from './users';
import Channels from './channels';
import Games from './games';

export const $axios = axios.create({
  baseURL: configService.getApiUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

setupInterceptors();

const repositories = {
  auth: Auth($axios),
  users: Users($axios),
  channels: Channels($axios),
  games: Games($axios),
};

export default repositories;

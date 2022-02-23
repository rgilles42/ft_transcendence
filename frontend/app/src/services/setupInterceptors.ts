/* eslint-disable import/no-cycle */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import api, { $axios } from '@/api';
import { useStore } from '../store/index';

const setupInterceptors = (): void => {
  $axios.interceptors.request.use(
    (config) => {
      const store = useStore();
      const xsrfToken = store.getXsrfToken;
      config.headers = config.headers ? config.headers : {};
      if (xsrfToken) {
        config.headers['x-xsrf-token'] = xsrfToken;
      }
      const accessToken = store.getAccessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  $axios.interceptors.response.use(
    (res) => res,
    async (err) => {
      const store = useStore();
      const originalConfig = err.config;
      if (originalConfig.url !== '/auth/login' && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const currentRefreshToken = store.getRefreshToken;
            if (currentRefreshToken) {
              const response = await api.auth.refreshToken(currentRefreshToken);
              const { accessToken, refreshToken, xsrfToken } = response.data;
              store.setTokens(accessToken, refreshToken);
              store.setXsrfToken(xsrfToken);
              return $axios(originalConfig);
            }
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    },
  );
};

export default setupInterceptors;

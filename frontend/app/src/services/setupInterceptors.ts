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
        const currentRefreshToken = store.getRefreshToken;
        if (err.response.status === 401 && currentRefreshToken && !store.getRefreshStatus) {
          store.setRefreshStatusOn();
          try {
            const response = await api.auth.refreshToken(currentRefreshToken);
            store.setTokens(response.data.access_token, response.data.refresh_token);
            store.setXsrfToken(response.data.xsrf_token);
            store.setRefreshStatusOff();
            return $axios(originalConfig);
          } catch (_error) {
            store.logoutUser();
            store.setRefreshStatusOff();
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    },
  );
};

export default setupInterceptors;

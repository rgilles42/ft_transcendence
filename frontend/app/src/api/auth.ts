import { AxiosInstance } from 'axios';

const AUTH_BASE = '/auth';

export default ($axios: AxiosInstance) => ({
  login() {
    return $axios.post(`${AUTH_BASE}/login`);
  },

  logout() {
    return $axios.post(`${AUTH_BASE}/logout`);
  },

});

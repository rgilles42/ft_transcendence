import { AxiosInstance } from 'axios';

const AUTH_BASE = '/auth';

export default ($axios: AxiosInstance) => ({

  // Auth Routes
  login() {
    return $axios.post(`${AUTH_BASE}/login`);
  },

  logout() {
    return $axios.post(`${AUTH_BASE}/logout`);
  },

  refreshToken(refreshToken : string | null) {
    return $axios.post(`${AUTH_BASE}/refreshToken`, { refreshToken });
  },

});

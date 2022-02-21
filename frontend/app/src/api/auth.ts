import { AxiosInstance } from 'axios';

const AUTH_BASE = '/auth';

export default ($axios: AxiosInstance) => ({

  // Auth Routes
  login(code: string, redirectUrl: string) {
    return $axios.get(`${AUTH_BASE}/42/callback`, { params: { code, redirectUrl } });
  },

  logout() {
    return $axios.post(`${AUTH_BASE}/logout`);
  },

  refreshToken(refreshToken : string | null) {
    return $axios.post(`${AUTH_BASE}/refresh`, { token: refreshToken });
  },

});

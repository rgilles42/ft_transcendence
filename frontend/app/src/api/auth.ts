import { AxiosInstance } from 'axios';

const AUTH_BASE = '/auth';

export default ($axios: AxiosInstance) => ({

  // Auth Routes
  localLogin(login: string) {
    return $axios.post(`${AUTH_BASE}/login`, { login });
  },

  fortyTwoLogin(code: string, redirectUrl: string) {
    return $axios.get(`${AUTH_BASE}/42/callback`, { params: { code, redirectUrl } });
  },

  logout() {
    return $axios.post(`${AUTH_BASE}/logout`);
  },

  refreshToken(refreshToken : string | null) {
    return $axios.post(`${AUTH_BASE}/refresh`, { refreshToken });
  },

  twoFactorLogin(code: string) {
    return $axios.post(`${AUTH_BASE}/2fa/authenticate`, { code });
  },

  twoFactorEnable(code: string) {
    return $axios.post(`${AUTH_BASE}/2fa/enable`, { code });
  },

  twoFactorDisable(code: string) {
    return $axios.delete(`${AUTH_BASE}/2fa/disable`, { params: { code } });
  },

});

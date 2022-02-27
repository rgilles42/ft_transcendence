import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import User from '@/types/User';

export const useStore = defineStore('main', {
  state: () => ({
    refreshStatus: false,
    user: useStorage<User | null>('user', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v),
      },
    }),
    tokens: {
      accessToken: useStorage<string | null>('access_token', null),
      refreshToken: useStorage<string | null>('refresh_token', null),
      xsrfToken: useStorage<string | null>('xsrf_token', null),
    },
  }),
  getters: {
    getRefreshStatus(): boolean {
      return this.refreshStatus;
    },
    getUser(): User | null {
      return this.user;
    },
    getAccessToken(): string | null {
      return this.tokens.accessToken;
    },
    getRefreshToken(): string | null {
      return this.tokens.refreshToken;
    },
    getXsrfToken(): string | null {
      return this.tokens.xsrfToken;
    },
  },
  actions: {
    setRefreshStatusOn() {
      this.refreshStatus = true;
    },
    setRefreshStatusOff() {
      this.refreshStatus = false;
    },
    logoutUser() {
      this.user = null;
      this.tokens.accessToken = null;
      this.tokens.refreshToken = null;
      this.tokens.xsrfToken = null;
    },
    setUser(user: User | null) {
      this.user = user;
    },
    setTokens(accessToken: string | null, refreshToken: string | null) {
      this.tokens.accessToken = accessToken;
      this.tokens.refreshToken = refreshToken;
    },
    setXsrfToken(xsrfToken: string | null) {
      this.tokens.xsrfToken = xsrfToken;
    },
  },
});

export default { useStore };

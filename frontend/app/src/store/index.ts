import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import User from '@/types/User';

export const useStore = defineStore('main', {
  state: () => ({
    user: useStorage<User | null>('user', null, undefined, {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v),
      },
    }),
    tokens: {
      accessToken: useStorage<string | null>('access-token', null),
      refreshToken: useStorage<string | null>('refresh-token', null),
    },
  }),
  getters: {
    getUser(): User | null {
      return this.user;
    },
    getAccessToken(): string | null {
      return this.tokens.accessToken;
    },
    getRefreshToken(): string | null {
      return this.tokens.refreshToken;
    },
  },
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setTokens(accessToken: string | null, refreshToken: string | null) {
      this.tokens.accessToken = accessToken;
      this.tokens.refreshToken = refreshToken;
    },
  },
});

export default { useStore };

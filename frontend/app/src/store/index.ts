import { defineStore } from 'pinia';
import User from '@/types/User';

export const useStore = defineStore('main', {
  state: () => ({
    user: null as User | null,
    tokens: {
      accesToken: null as string | null,
      refreshToken: null as string | null,
    },
  }),
  getters: {
    getUser(): User | null {
      return this.user;
    },
    getAccesToken(): string | null {
      return this.tokens.accesToken;
    },
    getRefreshToken(): string | null {
      return this.tokens.refreshToken;
    },
  },
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setTokens(accesToken: string | null, refreshToken: string | null) {
      this.tokens.accesToken = accesToken;
      this.tokens.refreshToken = refreshToken;
    },
  },
});

export default { useStore };

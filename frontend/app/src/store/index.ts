import { defineStore } from 'pinia';
import User from '@/types/User';

export const useStore = defineStore('main', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    getUser(): User | null {
      return this.user;
    },
  },
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
  },
});

export default { useStore };

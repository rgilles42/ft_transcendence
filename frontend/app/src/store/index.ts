import { defineStore } from 'pinia';
import User from '@/types/User';

export const useStore = defineStore('main', {
  state: () => ({
    user: null as User | null,
  }),
});

export default { useStore };

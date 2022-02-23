<template>
  <div>
    Page de logout
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import api from '@/api';

export default defineComponent({
  name: 'Logout',
  setup() {
    const router = useRouter();
    const store = useStore();
    if (!store.getUser) {
      router.replace('/');
    }
    const logout = () => {
      api.auth.logout().then(() => {
        store.logoutUser();
        router.replace('/');
      });
    };
    logout();
  },
});
</script>

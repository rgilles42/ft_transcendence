<template>
  <div>
    Page de login 42
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '@/store';
import api from '@/api';
import { isString } from '@vueuse/core';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    if (store.getUser || !route.query.code || !isString(route.query.code)) {
      router.replace('/');
      return;
    }
    const loginFortyTwo = (code: string) => {
      api.auth.login(code, `${window.location.origin}/auth/42/callback`).then((response) => {
        store.setTokens(response.data.access_token, response.data.refresh_token);
        store.setUser(response.data.user);
        router.replace('/');
      });
    };
    loginFortyTwo(route.query.code);
  },
});
</script>

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

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    if (store.getUser || !route.query.code) {
      router.replace('/');
      return;
    }
    const loginFortyTwo = (code: string) => {
      api.auth.fortyTwoLogin(code, `${window.location.origin}/auth/42/callback`).then((response) => {
        store.setTokens(response.data.access_token, response.data.refresh_token);
        store.setXsrfToken(response.data.xsrf_token);
        store.setUser(response.data.user);
        if (response.status === 201) {
          router.replace('/profile/me');
        } else {
          router.replace('/');
        }
      });
    };
    loginFortyTwo(route.query.code.toString());
  },
});
</script>

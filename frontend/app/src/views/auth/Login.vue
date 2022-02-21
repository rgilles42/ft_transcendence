<template>
  <div>
    Page de login

    <button @click="localLogin()">Log local</button>

    <button @click="goToFortyTwo()">Log with 42</button>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useStore();
    if (store.getUser) {
      router.replace('/');
    }
    const goToFortyTwo = () => {
      const query = {
        client_id: process.env.VUE_APP_FORTY_TWO_CLIENT_ID,
        redirect_uri: `${window.location.origin}/auth/42/callback`,
        response_type: 'code',
      };
      const url = 'https://api.intra.42.fr/oauth/authorize';
      const queryString = new URLSearchParams(query).toString();
      const newUrl = `${url}${queryString.length > 0 ? `?${queryString}` : ''}`;

      window.location.href = newUrl;
    };

    const localLogin = () => {
      api.auth.localLogin().then((response) => {
        store.setUser(response.data);
        router.replace('/');
      });
    };

    return {
      localLogin,
      goToFortyTwo,
    };
  },
});
</script>

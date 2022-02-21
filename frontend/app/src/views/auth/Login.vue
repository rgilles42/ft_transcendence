<template>
  <div>
    Page de login

    <button @click="goToForthyTwo()">Log with 42</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Login',
  setup() {
    const goToForthyTwo = () => {
      const query = {
        client_id: process.env.VUE_APP_FORTHY_TWO_CLIENT_ID,
        redirect_uri: `${window.location.origin}/auth/42/callback`,
        response_type: 'code',
      };
      const url = 'https://api.intra.42.fr/oauth/authorize';
      const queryString = new URLSearchParams(query).toString();
      const newUrl = `${url}${queryString.length > 0 ? `?${queryString}` : ''}`;

      window.location.href = newUrl;
    };

    return {
      goToForthyTwo,
    };
  },
});
</script>

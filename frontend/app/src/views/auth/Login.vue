<template>
  <div>
    <div class="container mx-auto p-8">
      <div class="mx-auto max-w-sm">
        <div class="bg-gray-800 rounded shadow">
            <div class="border-b py-8 font-bold text-center text-xl tracking-widest uppercase">
              Connexion
            </div>

            <div v-if="!isProduction" class="bg-grey-lightest px-10 py-5">
              <div class="mb-6">
                <input name="login" v-model.trim="loginRef" @keyup.enter="localLogin(loginRef)" type="text" placeholder="Login 42" class="block w-full py-2 m-0 pl-4 rounded-full focus:outline-none">
              </div>
              <div class="flex">
                <button @click="localLogin(loginRef)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none w-full p-4 text-sm rounded-full uppercase font-bold tracking-wider">
                  Se connecter
                </button>
              </div>
            </div>

            <div class="border-t px-10 py-6">
              <div class="flex justify-center">
                <button @click="goToFortyTwo()" class="bg-blue-700 hover:bg-blue-600 transition duration-100 ease-in-out text-white focus:outline-none p-4 text-sm rounded-full uppercase tracking-wider">
                  Login with 42
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent, ref } from 'vue';
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
    const loginRef = ref('');
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

    const localLogin = (login: string) => {
      api.auth.localLogin(login).then((response) => {
        store.setTokens(response.data.access_token, response.data.refresh_token);
        store.setXsrfToken(response.data.xsrf_token);
        store.setUser(response.data.user);
        router.replace('/');
      });
    };

    return {
      loginRef,
      isProduction: ['production', 'prod'].includes(process.env.NODE_ENV),
      localLogin,
      goToFortyTwo,
    };
  },
});
</script>

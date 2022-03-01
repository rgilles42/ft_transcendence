<template>
  <div>
    <div class="container mx-auto p-8">
      <div class="mx-auto max-w-sm">
        <div class="bg-gray-800 rounded shadow">
            <div class="border-b py-8 font-bold text-center text-xl tracking-widest uppercase">
              Connexion
            </div>

            <div v-if="!isProduction" class="bg-grey-lightest px-10 py-5">
              <form @submit.prevent="localLogin(loginRef)">
                <div class="mb-6">
                  <FormInput title="Login 42" name="login" v-model.trim="loginRef" placeholder="Login 42" required />
                </div>
                <div class="flex">
                  <button class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none w-full p-4 text-sm rounded-full uppercase font-bold tracking-wider">
                    Se connecter
                  </button>
                </div>
              </form>
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
import { configService } from '@/services/configService';
import FormInput from '@/components/form/FormInput.vue';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useStore();
    if (store.getUser) {
      router.replace({ name: 'Home' });
    }
    const loginRef = ref('');
    const goToFortyTwo = () => {
      const query = {
        client_id: configService.getFortyTwoConfig().clientId,
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
        if (response.data.isTwoFactorEnable === true) {
          router.push({ name: 'Login2fa' });
        } else if (response.status === 201) {
          router.push({ name: 'MyProfile' });
        } else {
          router.push({ name: 'Home' });
        }
      });
    };
    return {
      loginRef,
      isProduction: configService.isProduction(),
      localLogin,
      goToFortyTwo,
    };
  },
  components: { FormInput },
});
</script>

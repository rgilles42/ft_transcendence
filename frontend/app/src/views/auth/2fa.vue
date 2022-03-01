<template>
  <div>
    <div class="container mx-auto p-8">
      <div class="mx-auto max-w-sm">
        <div class="bg-gray-800 rounded shadow">
            <div class="border-b py-8 font-bold text-center text-xl tracking-widest uppercase">
              Connexion 2FA
            </div>

            <div class="bg-grey-lightest px-10 py-5">
              <form @submit.prevent="twoFactorLogin(codeRef)">
                <div class="mb-6">
                  <FormInput title="Code" placeholder="Code" name="code" :errors="errors" v-model.trim="codeRef" required />
                </div>
                <div class="flex">
                  <button class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none w-full p-4 text-sm rounded-full uppercase font-bold tracking-wider">
                    Envoyer le code
                  </button>
                </div>
              </form>
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
import FormInput from '@/components/form/FormInput.vue';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useStore();
    if (store.getUser) {
      router.replace({ name: 'Home' });
    }
    const codeRef = ref('');
    const errors = ref<any>({});

    const twoFactorLogin = (login: string) => {
      errors.value = {};

      api.auth.twoFactorLogin(login)
        .then((response) => {
          store.setTokens(response.data.access_token, response.data.refresh_token);
          store.setXsrfToken(response.data.xsrf_token);
          store.setUser(response.data.user);

          if (response.status === 201) {
            router.push({ name: 'MyProfile' });
          } else {
            router.push({ name: 'Home' });
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            errors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };
    return {
      codeRef,
      errors,
      twoFactorLogin,
    };
  },
  components: { FormInput },
});
</script>

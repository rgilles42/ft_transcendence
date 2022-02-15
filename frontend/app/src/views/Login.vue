<template>
  <div>
    Page de login
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import api from '@/api';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const store = useStore();
    if (store.user) {
      router.replace('/');
    }
    const login = () => {
      api.auth.login().then((response) => {
        store.user = response.data;
        router.replace('/');
      });
    };
    login();
  },
});
</script>

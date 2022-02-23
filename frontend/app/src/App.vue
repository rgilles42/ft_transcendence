<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex-grow min-h-screen">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '@/api';
import { useRoute, useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { useStore } from './store';

export default defineComponent({
  components: {
    Navbar,
    Footer,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const refreshCurrentUser = () => {
      api.users.getMyUser()
        .then((response) => {
          store.setUser(response.data);
        })
        .catch(() => {
          store.logoutUser();
          if (route.meta.requiresAuth) {
            router.replace('/auth/login');
          }
        });
    };

    if (store.getUser) {
      refreshCurrentUser();
    }
  },
});
</script>

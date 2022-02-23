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
import api, { $axios } from '@/api';
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

    const refreshCurrentUser = () => {
      api.users.getMyUser().then((response) => {
        store.setUser(response.data.user);
      });
    };

    if (store.getUser) {
      refreshCurrentUser();
    }
  },
});
</script>

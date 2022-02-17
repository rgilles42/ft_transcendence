<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex-grow" style="margin-top: 50px;">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
  components: { Navbar, Footer },
  setup() {
    const store = useStore();
    // const users = ref<User[]>();
    // const getUsers = () => {
    //   api.users.getUsers()
    //     .then((response) => {
    //       users.value = response.data;
    //     });
    // };
    // getUsers();
    return {
      currentUser: computed(() => store.getUser),
    };
  },
});
</script>

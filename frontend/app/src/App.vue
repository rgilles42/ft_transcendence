<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <router-view class="flex-grow" style="padding-top: 50px;" />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore } from '@/store';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
  components: { Navbar, Footer },
  setup() {
    const store = useStore();
    const { user } = storeToRefs(store);
    // const users = ref<User[]>();
    // const getUsers = () => {
    //   api.users.getUsers()
    //     .then((response) => {
    //       users.value = response.data;
    //     });
    // };
    // getUsers();
    return {
      currentUser: user,
    };
  },
});
</script>

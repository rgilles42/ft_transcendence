<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <ChatBox />
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
import ChatBox from './components/ChatBox.vue';

export default defineComponent({
  components: { Navbar, Footer, ChatBox },
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

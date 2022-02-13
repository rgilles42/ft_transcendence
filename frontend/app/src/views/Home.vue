<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>

    <div>
      {{ users }}
    </div>

    <div>
      {{ currentUser }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api';
import { useStore } from '@/store';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import User from '@/types/User';

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup() {
    const store = useStore();
    const users = ref<User[]>();

    const getUsers = () => {
      api.users.getUsers()
        .then((response) => {
          users.value = response.data;
        });
    };

    getUsers();

    return {
      users,

      currentUser: store.user,
    };
  },
});
</script>

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
import { defineComponent, watch } from 'vue';
import api from '@/api';
import websocketApi from '@/websocketsApi';
import { useRoute, useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { useStore } from './store';
import * as userUtils from './services/userUtils';
import { DEFAULT_USER } from './types/User';

export default defineComponent({
  components: {
    Navbar,
    Footer,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const refreshCurrentUser = async () => {
      try {
        const response = await api.users.getMyUser();
        store.setUser(response.data);
      } catch (err) {
        store.logoutUser();
        if (route.meta.requiresAuth) {
          router.replace('/auth/login');
        }
        throw (err);
      }
    };

    const updateFriendsStatus = (friendsStatus: [{ id: number, newStatus: number }]) => {
      const currentUser = store.getUser;
      friendsStatus.forEach((friendStatus) => {
        if (currentUser && currentUser.friends) {
          const friendShip = userUtils.getUserFriend(currentUser, { ...DEFAULT_USER, id: friendStatus.id });
          if (friendShip) {
            if (friendShip.user && friendShip.userId === friendStatus.id) {
              friendShip.user.status = friendStatus.newStatus;
            } else if (friendShip.friend && friendShip.friendId === friendStatus.id) {
              friendShip.friend.status = friendStatus.newStatus;
            }
          }
        }
      });
    };
    websocketApi.usersStatus.onUsersStatusUpdate(updateFriendsStatus);

    watch(() => store.getUser, (to, from) => {
      if (!from && to) {
        websocketApi.usersStatus.connect();
      } else if (!to && from) {
        websocketApi.usersStatus.disconnect();
      }
    });

    if (store.getUser) {
      refreshCurrentUser().then(() => {
        if (store.getUser) {
          websocketApi.usersStatus.connect();
        }
      });
    }
  },
});
</script>

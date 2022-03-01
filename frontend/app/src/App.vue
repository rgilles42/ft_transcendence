<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex-grow min-h-screen">
      <router-view />
    </div>
    <Modal :openStatus="modalData.isOpen" @close="closeModal()">
      <template v-slot:title>Un utisateur vous provoque en duel sur {{ modalData.map }}!</template>
      <template v-slot:actions>
        <button @click="closeModal()" class="bg-red-900 hover:bg-red-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-sm rounded-lg tracking-wider">Refuser</button>
        <button @click="closeModal(false)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-sm rounded-lg tracking-wider">Accepter</button>
      </template>
    </Modal>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import api from '@/api';
import websocketApi from '@/websocketsApi';
import { useRoute, useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { useStore } from './store';
import * as userUtils from './services/userUtils';
import { DEFAULT_USER } from './types/User';
import chatUtils from './services/chatUtils';
import Modal from './components/Modal.vue';

export default defineComponent({
  components: {
    Navbar,
    Footer,
    Modal,
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
          router.replace({ name: 'Login' });
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

    const modalData = ref({
      isOpen: false,
      map: null as any,
      userId: null as any,
    });

    const ongGameInvit = (userId: number, map: any) => {
      modalData.value.isOpen = true;
      modalData.value.map = map;
      modalData.value.userId = userId;
    };
    websocketApi.usersStatus.onInvitGame(ongGameInvit);

    const closeModal = (canceled = true) => {
      modalData.value.isOpen = false;
      if (canceled) {
        modalData.value.map = null;
        modalData.value.userId = null;
        return;
      }
      router.push({ name: 'GameList', params: { startGameId: modalData.value.userId, startGameMap: modalData.value.map } });
      modalData.value.map = null;
      modalData.value.userId = null;
    };

    return {
      closeModal,
      modalData,
    };
  },
});
</script>

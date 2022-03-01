<template>
  <div class="mb-8">
    <div class="margin-navbar"></div>
    <section class="container mx-auto">

      <template v-if="!chatData">
        <Loader />
      </template>
      <template v-else>
        <ChatBox
          class="chatBox"
          :chatData="chatData"
          :me="currentUser"
          @submitMessage="sendMessage"
          ref="chatBoxRef"
        />
      </template>

    </section>

    <Modal :openStatus="isModalOpen" @close="closeModal()">
      <template v-slot:title>
        <template v-if="chatUtils.isUserIsOwner(chatData, currentUser?.id)">
          Voulez-vous supprimer ce salon ?
        </template>
        <template v-else>
          Voulez-vous quitter ce salon ?
        </template>
      </template>
      <template v-slot:actions>
        <button @click="closeModal()" class="bg-orange-900 hover:bg-orange-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-sm rounded-lg tracking-wider">Annuler</button>
        <button @click="closeModal(false)" class="bg-red-900 hover:bg-red-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-sm rounded-lg tracking-wider">
          <template v-if="chatUtils.isUserIsOwner(chatData, currentUser?.id)">
            Supprimer ce salon
          </template>
          <template v-else>
            Quitter ce salon
          </template>
        </button>
      </template>
    </Modal>

    <div v-if="chatData && true" class="fixed bottom-10 right-10 group">
      <router-link
        :to="{ name: 'ChatIdEdit', params: { requestChatId: chatData.id } }"
        class="rounded-full h-14 w-14 flex items-center justify-center no-underline hover:no-underline text-white"
        role="menuitem"
        :class="[chatUtils.isUserIsAdmin(chatData, currentUser?.id) ? 'bg-blue-500' : 'pointer-events-none bg-gray-500']"
      >
        <i class="fas fa-pen"></i>
      </router-link>
      <ul class="group-hover:opacity-100 absolute bottom-12 left-0 right-0 opacity-0 duration-200">
        <li v-if="chatUtils.isUserIsOwner(chatData, currentUser?.id)" class="block mb-4 transform">
          <button @click="openModal" class="transform scale-50 group-hover:scale-100 group-hover:-translate-y-4 transition duration-200 m-auto bg-red-500 rounded-full h-10 w-10 flex items-center justify-center focus:outline-none text-white shadow">
            <i class="fas fa-trash-alt"></i>
          </button>
        </li>
        <li v-else class="block mb-4 transform">
          <button @click="openModal" class="transform scale-50 group-hover:scale-100 group-hover:-translate-y-4 transition duration-200 m-auto bg-orange-500 rounded-full h-10 w-10 flex items-center justify-center focus:outline-none text-white shadow">
            <i class="fa-solid fa-person-running"></i>
          </button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onBeforeUnmount, nextTick,
} from 'vue';
import { Socket } from 'socket.io-client';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import api from '@/api';
import webSocketsApi from '@/websocketsApi';
import Channel from '@/types/Channel';
import ChannelMessage from '@/types/ChannelMessage';
import ChannelMember from '@/types/ChannelMember';
import Loader from '@/components/Loader.vue';
import ChatBox from '@/components/chat/ChatBox.vue';
import * as chatUtils from '@/services/chatUtils';
import Modal from '@/components/Modal.vue';
import ChannelRestriction from '@/types/ChannelRestriction';

export default defineComponent({
  name: 'ChatId',
  components: { ChatBox, Loader, Modal },
  props: {
    requestChatId: String,
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const currentUser = computed(() => store.getUser);
    const chatData = ref<Channel | undefined>();
    const chatBoxRef = ref<any>();

    // Socket channel methods

    const sendMessage = (content: ChannelMessage['content']) => {
      if (!chatData.value || !chatData.value.messages) return;
      if (!webSocketsApi.chat.connected) return;
      webSocketsApi.chat.emitNewMessage(chatData.value.id, content);
    };

    const onNewMessage = (newMessage: ChannelMessage) => {
      if (!chatData.value) {
        return;
      }
      if (!chatData.value.messages) {
        chatData.value.messages = [];
      }
      chatData.value.messages.push(newMessage);
      nextTick(() => {
        if (chatBoxRef.value) {
          chatBoxRef.value.scrollToBottom();
        }
      });
    };

    const onNewMember = (newMessage: ChannelMember) => {
      if (!chatData.value) {
        return;
      }
      if (!chatData.value.members) {
        chatData.value.members = [];
      }
      chatData.value.members.push(newMessage);
    };

    const onDeletedMember = (deletedMembers: ChannelMember['id']) => {
      if (!chatData.value) {
        return;
      }
      if (!chatData.value.members) {
        chatData.value.members = [];
      }
      const index = chatData.value.members.findIndex((find) => find.id === deletedMembers);
      if (index > -1) {
        chatData.value.members.splice(index, 1);
      }
    };

    const onNewRestriction = (newRestriction: ChannelRestriction) => {
      if (!chatData.value) {
        return;
      }
      if (!chatData.value.restrictions) {
        chatData.value.restrictions = [];
      }
      chatData.value.restrictions.push(newRestriction);
    };

    const onDeletedRestriction = (deletedRestriction: ChannelRestriction['id']) => {
      if (!chatData.value) {
        return;
      }
      if (!chatData.value.restrictions) {
        chatData.value.restrictions = [];
      }
      const index = chatData.value.restrictions.findIndex((find) => find.id === deletedRestriction);
      if (index > -1) {
        chatData.value.restrictions.splice(index, 1);
      }
    };

    const onConnectionSuccess = () => {
      if (!chatData.value) {
        return;
      }
      webSocketsApi.chat.joinChannel(chatData.value.id);
    };

    const disconnectSocket = (errOrReason?: Socket.DisconnectReason | Error) => {
      webSocketsApi.chat.offNewMessage(onNewMessage);
      webSocketsApi.chat.offNewMember(onNewMember);
      webSocketsApi.chat.offDeletedMember(onDeletedMember);
      webSocketsApi.chat.offNewRestriction(onNewRestriction);
      webSocketsApi.chat.offDeletedRestriction(onDeletedRestriction);
      webSocketsApi.chat.offConnectionSuccess(onConnectionSuccess);
      webSocketsApi.chat.offConnectionFailed(disconnectSocket);
      webSocketsApi.chat.offDisconnected(disconnectSocket);
      webSocketsApi.chat.disconnect();
      if (errOrReason !== undefined) {
        router.replace({ name: 'ChatList' });
      }
    };
    onBeforeUnmount(() => disconnectSocket());

    const initChatSocket = () => {
      webSocketsApi.chat.onNewMessage(onNewMessage);
      webSocketsApi.chat.onNewMember(onNewMember);
      webSocketsApi.chat.onDeletedMember(onDeletedMember);
      webSocketsApi.chat.onNewRestriction(onNewRestriction);
      webSocketsApi.chat.onDeletedRestriction(onDeletedRestriction);
      webSocketsApi.chat.onConnectionSuccess(onConnectionSuccess);
      webSocketsApi.chat.onConnectionFailed(disconnectSocket);
      webSocketsApi.chat.onDisconnected(disconnectSocket);
    };
    initChatSocket();

    // Delete channel methods

    const deleteChannel = () => {
      if (!currentUser.value || !chatData.value || !chatUtils.isUserIsOwner(chatData.value, currentUser.value.id)) {
        return;
      }
      api.channels.deleteChannelById(chatData.value.id)
        .then(() => {
          router.replace({ name: 'ChatList' });
        });
    };

    const leaveChannel = () => {
      if (!currentUser.value || !chatData.value || chatUtils.isUserIsOwner(chatData.value, currentUser.value.id)) {
        return;
      }
      const member = chatUtils.getMember(chatData.value, currentUser.value.id);
      if (!member) {
        return;
      }
      api.channels.deleteChannelMembersById(member.id)
        .then(() => {
          router.replace({ name: 'ChatList' });
        });
    };

    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = (canceled = true) => {
      isModalOpen.value = false;
      if (canceled) {
        return;
      }
      if (chatUtils.isUserIsOwner(chatData.value, currentUser.value?.id)) {
        deleteChannel();
      } else {
        leaveChannel();
      }
    };

    // Get channel data methods

    const getChannelData = (channelId: Channel['id']) => {
      api.channels.getChannelById(channelId)
        .then((response) => {
          chatData.value = response.data;
          webSocketsApi.chat.connect();

          nextTick(() => {
            if (chatBoxRef.value) {
              chatBoxRef.value.scrollToBottom();
            }
          });
        })
        .catch(() => {
          router.replace({ name: 'ChatList' });
        });
    };
    if (props.requestChatId === undefined) {
      router.replace({ name: 'ChatList' });
    } else {
      getChannelData(+props.requestChatId);
    }

    return {
      // Utils
      chatUtils,
      // Utils
      chatData,
      currentUser,
      chatBoxRef,
      sendMessage,
      // Delete Channel
      isModalOpen,
      openModal,
      closeModal,
    };
  },
});
</script>

<style scoped>
.chatBox {
  max-height: 80vh;
}
</style>

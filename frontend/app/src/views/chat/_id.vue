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
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, onBeforeUnmount, nextTick,
} from 'vue';
import api from '@/api';
import Channel from '@/types/Channel';
import ChannelMessage from '@/types/ChannelMessage';
import ChatBox from '@/components/chat/ChatBox.vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import webSocketsApi from '@/websocketsApi';
import Loader from '@/components/Loader.vue';
import ChannelMember from '@/types/ChannelMember';
import { Socket } from 'socket.io-client';

export default defineComponent({
  name: 'ChatId',
  components: { ChatBox, Loader },
  props: {
    requestChatId: String,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const currentUser = computed(() => store.getUser);
    const chatData = ref<Channel | undefined>();
    const chatBoxRef = ref<any>();

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

    const onConnectionSuccess = () => {
      if (!chatData.value) {
        return;
      }
      webSocketsApi.chat.joinChannel(chatData.value.id);
    };

    const disconnectSocket = (errOrReason?: Socket.DisconnectReason | Error) => {
      webSocketsApi.chat.offNewMessage(onNewMessage);
      webSocketsApi.chat.offNewMember(onNewMember);
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
      webSocketsApi.chat.onConnectionSuccess(onConnectionSuccess);
      webSocketsApi.chat.onConnectionFailed(disconnectSocket);
      webSocketsApi.chat.onDisconnected(disconnectSocket);
    };
    initChatSocket();

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
      sendMessage,
      chatData,
      currentUser,
      chatBoxRef,
    };
  },
});
</script>

<style scoped>
.chatBox {
  max-height: 80vh;
}
</style>

<template>
  <div>
    <ChatBox
      :chatData="chatData"
      :me="currentUser"
      @submitMessage="sendMessage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import api from '@/api';
import Channel from '@/types/Channel';
import ChannelMessage from '@/types/ChannelMessage';
import ChatBox from '@/components/chat/ChatBox.vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import webSocketsApi from '@/websocketsApi';

export default defineComponent({
  name: 'ChatId',
  components: { ChatBox },
  props: {
    requestChatId: String,
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const currentUser = computed(() => store.getUser);

    const chatData = ref<Channel | undefined>();

    const onNewMessage = (newMessage: ChannelMessage) => {
      if (!chatData.value || !chatData.value.messages) {
        return;
      }
      chatData.value.messages.push(newMessage);
    };

    const onConnectionSuccess = () => {
      if (!chatData.value) {
        return;
      }
      webSocketsApi.chat.joinChannel(chatData.value.id);
    };

    webSocketsApi.chat.onNewMessage(onNewMessage);
    webSocketsApi.chat.onConnectionSuccess(onConnectionSuccess);

    const getChannelData = (channelId: Channel['id']) => {
      api.channels.getChannelById(channelId)
        .then((response) => {
          chatData.value = response.data;
          webSocketsApi.chat.connect();
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

    const sendMessage = (content: ChannelMessage['content']) => {
      if (!chatData.value || !chatData.value.messages) return;
      if (!webSocketsApi.chat.connected) return;

      webSocketsApi.chat.emitNewMessage(chatData.value.id, content);

      setTimeout(() => {
        const element = document.getElementById('chat__body');
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      }, 0);
    };

    return {
      sendMessage,
      chatData,
      currentUser,
    };
  },
});
</script>

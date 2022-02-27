<template>
  <div v-if="chatData">
    <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col bg-gray-800">
      <ChatHeader :chatTitle="chatData.title" />
      <ChatMessages :messages="chatMessages" :me="me"></ChatMessages>
      <ChatForm @submitMessage="sendMessage" :disabled="chatUtils.isUserMuted(chatData, me?.id)"></ChatForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ChatMessages from '@/components/chat/ChatMessages.vue';
import ChatForm from '@/components/chat/ChatForm.vue';
import ChannelMessage from '@/types/ChannelMessage';
import ChatHeader from '@/components/chat/ChatHeader.vue';
import Channel from '@/types/Channel';
import User from '@/types/User';
import * as chatUtils from '@/services/chatUtils';

export default defineComponent({
  name: 'ChatBox',
  components: { ChatMessages, ChatForm, ChatHeader },
  props: {
    chatData: Object as () => Channel,
    me: Object as () => User | null,
  },
  setup(props, { emit }) {
    const sendMessage = (content: ChannelMessage['content']) => {
      emit('submitMessage', content);
    };

    const chatMessages = computed(() => chatUtils.getChatMessages(props.chatData));

    return {
      sendMessage,
      chatUtils,
      chatMessages,
    };
  },
});
</script>

<template>
  <div v-if="chatData" class="flex flex-col flex-1 p-2 sm:p-6 justify-between bg-gray-800">
    <ChatHeader :chatTitle="chatData.title" />
    <ChatMessages :messages="chatMessages" :chatData="chatData" :me="me" ref="chatMessagesRef"></ChatMessages>
    <ChatForm @submitMessage="sendMessage" :disabled="isUserMuted"></ChatForm>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed, ref, watch,
} from 'vue';
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
    const chatMessagesRef = ref<any>(null);

    const scrollToBottom = () => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollToBottom();
      }
    };

    const sendMessage = (content: ChannelMessage['content']) => {
      emit('submitMessage', content);
    };

    const chatMessages = computed(() => {
      const messages = chatUtils.getChatMessages(props.chatData);
      return messages.filter((message) => {
        if (!props.me || !props.me.blockedUsers) return true;
        return !props.me.blockedUsers.some((blocked) => blocked.blockedId === message.userId);
      });
    });

    const isUserMuted = ref(chatUtils.isUserMuted(props.chatData, props.me?.id));

    const mutedLoop = () => {
      let mutedInterval: number | null = setInterval(() => {
        isUserMuted.value = chatUtils.isUserMuted(props.chatData, props.me?.id);
        if (mutedInterval !== null && !isUserMuted.value) {
          clearInterval(mutedInterval);
          mutedInterval = null;
        }
      }, 1000);
    };

    if (isUserMuted.value) {
      mutedLoop();
    }

    return {
      sendMessage,
      chatUtils,
      chatMessagesRef,
      chatMessages,
      scrollToBottom,
      isUserMuted,
    };
  },
});
</script>

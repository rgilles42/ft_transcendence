<template>
  <div
    v-if="messages"
    class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    ref="chatMessagesRef"
  >
    <chat-message
      v-for="(message, index) in messages"
      :key="index"
      :message="message"
      :chatData="chatData"
      :prev="(index == 0 ? undefined : messages[index - 1])"
      :me="me"
    >
    </chat-message>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ChatMessage from '@/components/chat/ChatMessage.vue';
import ChannelMessage from '@/types/ChannelMessage';
import User from '@/types/User';
import Channel from '@/types/Channel';

export default defineComponent({
  name: 'ChatMessages',
  components: { ChatMessage },
  props: {
    chatData: Object as () => Channel,
    messages: Object as () => ChannelMessage[],
    me: Object as () => User | null,
  },
  setup() {
    const chatMessagesRef = ref<any>(null);

    const scrollToBottom = () => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
      }
    };

    return {
      scrollToBottom,
      chatMessagesRef,
    };
  },
});
</script>

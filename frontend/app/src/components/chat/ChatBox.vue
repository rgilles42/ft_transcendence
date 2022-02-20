<template>
  <div>
    <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col bg-gray-800">
      <ChatHeader :chatTitle="chatTitle" />
      <ChatMessages :messages="chatMessages" :me="me"></ChatMessages>
      <ChatForm @submitMessage="sendMessage" :disabled="isUserMuted(me?.id)"></ChatForm>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { compareAscDateFns } from '@/services/formater';
import ChatMessages from '@/components/chat/ChatMessages.vue';
import ChatForm from '@/components/chat/ChatForm.vue';
import ChannelMessage from '@/types/ChannelMessage';
import ChatHeader from '@/components/chat/ChatHeader.vue';
import Channel from '@/types/Channel';
import User from '@/types/User';

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

    const isUserMe = (userId: User['id'] | null | undefined) => {
      if (userId === undefined || userId == null) {
        return false;
      }
      return props.me && userId === props.me.id;
    };

    const chatRestrictions = computed(() => {
      if (!props.chatData || !props.chatData.restrictions) return [];
      return props.chatData.restrictions;
    });

    const isUserMuted = (userId: User['id'] | null | undefined) => {
      if (userId === undefined || userId === null) return false;
      const currentDate = new Date();
      return chatRestrictions.value.some((restrictedUser) => {
        if ((userId !== restrictedUser.userId)) return false;
        if (restrictedUser.endAt === null) return true;
        return (compareAscDateFns(currentDate, restrictedUser.endAt) <= 0);
      });
    };

    const chatMessages = computed(() => {
      if (!props.chatData || !props.chatData.messages) return [];
      return props.chatData.messages;
    });

    const chatTitle = computed(() => {
      if (!props.chatData || !props.chatData.members) return '';
      let title = '';
      props.chatData.members.forEach((member) => {
        if (!isUserMe(member.userId)) {
          if (member.user) {
            if (title.length <= 0) {
              title = `${member.user.username}`;
            } else {
              title += `, ${member.user.username}`;
            }
          }
        }
      });
      return title;
    });

    return {
      sendMessage,
      isUserMuted,
      chatTitle,
      chatMessages,
    };
  },
});
</script>

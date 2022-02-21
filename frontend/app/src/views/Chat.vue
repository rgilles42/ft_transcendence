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
import Channel from '@/types/Channel';
import ChannelMessage from '@/types/ChannelMessage';
import ChatBox from '@/components/chat/ChatBox.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Chat',
  components: { ChatBox },
  setup() {
    const store = useStore();

    const currentUser = computed(() => store.getUser);

    const chatData = ref<Channel>({
      id: 1,
      ownerId: 11,
      type: false,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      members: [
        {
          id: 1,
          channelId: 1,
          userId: 10,
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 10,
            login: 'ppaglier',
            username: 'John Deamers',
            imageUrl: 'https://cdn.intra.42.fr/users/ppaglier.jpg',
            status: 0,
          },
        },
        {
          id: 2,
          channelId: 1,
          userId: 11,
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 11,
            username: 'frossiny',
            login: 'frossiny',
            status: 0,
          },
        },
      ],
      messages: [
        {
          id: 1,
          channelId: 1,
          userId: 11,
          content: 'Salut',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 11,
            username: 'frossiny',
            login: 'frossiny',
            status: 0,
          },
        },
        {
          id: 2,
          channelId: 1,
          userId: 10,
          content: 'Salut brooo',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 10,
            login: 'ppaglier',
            username: 'John Deamers',
            imageUrl: 'https://cdn.intra.42.fr/users/ppaglier.jpg',
            status: 0,
          },
        },
        {
          id: 2,
          channelId: 1,
          userId: 10,
          content: 'comment tu va broooo ?',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 10,
            login: 'ppaglier',
            username: 'John Deamers',
            imageUrl: 'https://cdn.intra.42.fr/users/ppaglier.jpg',
            status: 0,
          },
        },
        {
          id: 1,
          channelId: 1,
          userId: 11,
          content: 'ez',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 11,
            username: 'frossiny',
            login: 'frossiny',
            status: 0,
          },
        },
      ],
      restrictions: [
        {
          id: 0,
          channelId: 1,
          userId: 10,
          type: 0,
          endAt: new Date('2022-02-21 17:29:00'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    const sendMessage = (content: ChannelMessage['content']) => {
      if (!chatData.value || !chatData.value.messages) return;

      chatData.value.messages.push({
        id: 1,
        channelId: 1,
        userId: 10,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 10,
          login: 'ppaglier',
          username: 'John Deamers',
          imageUrl: 'https://cdn.intra.42.fr/users/ppaglier.jpg',
          status: 0,
        },
      });

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

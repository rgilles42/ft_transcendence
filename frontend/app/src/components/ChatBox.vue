<template>
  <div>
    <div class="flex-1 p:2 sm:p-6 justify-between flex flex-col bg-gray-800">
      <div class="flex sm:items-center justify-between py-3 border-b border-gray-700">
        <div class="flex items-center space-x-4">
          <div class="flex flex-col leading-tight">
              <div class="text-2xl mt-1 flex items-center">
                <span class="mr-3">{{ chatTitle }}</span>
              </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">

          <template v-for="(message, index) in messages" :key="index">
            <div class="chat-message">
              <div class="flex items-end" :class="[isUserMe(message.user) ? 'justify-end' : '']">
                <div class="flex flex-col space-y-2 max-w-xs mx-2 order-2 items-end" :class="[isUserMe(message.user) ? 'items-end' : 'items-start']">
                  <div><span class="px-4 py-2 rounded-lg inline-block" :class="[isUserMe(message.user) ? 'bg-blue-600 text-white last:rounded-br-none' : 'bg-gray-500 text-white last:rounded-bl-none']">{{ message.content }}</span></div>
                </div>
                <AccountAvatar :user="message.user" alt="avatar" class="w-8 h-8 rounded-full" :class="[isUserMe(message.user) ? 'order-2' : ' order-1']" />
              </div>
            </div>
          </template>

      </div>

      <form @submit="sendMessage">
        <div class="flex sm:items-center justify-between px-3 border-t border-gray-700">
          <input type="text" placeholder="Message" class="block w-full py-2 pl-4 m-3 rounded-full focus:outline-none" v-model="newMessageContent" required />
          <button type="submit" class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import User from '@/types/User';
import ChannelMessage from '@/types/ChannelMessage';
import Channel from '@/types/Channel';
import api from '@/api';
import { defineComponent, computed, ref } from 'vue';
import AccountAvatar from './AccountAvatar.vue';

export default defineComponent({
  name: 'ChatBox',
  setup() {
    const store = useStore();
    const chatData: Channel = {
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
      restrictions: [],
    };
    const currentUser = computed(() => store.getUser);
    const isUserMe = (user: User | null | undefined) => {
      if (!user) {
        return false;
      }
      return currentUser.value && user.id === currentUser.value.id;
    };
    const messages = computed(() => {
      if (!chatData || !chatData.messages) { return []; }
      return chatData.messages;
    });
    const chatTitle = computed(() => {
      if (!chatData || !chatData.members) { return ''; }
      let title = '';
      chatData.members.forEach((member) => {
        if (!isUserMe(member.user)) {
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
    const isFirstMessage = (index: number) => {
      if (index === 0) { return true; }
      const message = messages.value[index];
      const previousMessage = messages.value[index - 1];
      return !previousMessage || previousMessage.userId !== message.userId;
    };
    const isLastMessage = (index: number) => {
      if (index === 0) { return true; }
      const message = messages.value[index];
      const nextMessage = messages.value[index + 1];
      return !nextMessage || nextMessage.userId !== message.userId;
    };

    const newMessageContent = ref('');

    const sendMessage = (event: Event) => {
      event.preventDefault();
      const content = newMessageContent.value.trim();
      if (content.length <= 0) return;
      const newMessage: ChannelMessage = {
        id: 0,
        channelId: chatData.id,
        userId: currentUser.value?.id || 0,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      api.channels.addChannelMessages(chatData.id, newMessage)
        .then(() => {
          newMessageContent.value = '';
          console.log(newMessage);
        });
    };

    return {
      messages,
      chatTitle,
      isUserMe,
      newMessageContent,
      sendMessage,
    };
  },
  components: { AccountAvatar },
});
</script>

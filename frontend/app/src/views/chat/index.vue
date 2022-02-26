<template>
  <div>
    <div class="margin-navbar"></div>
    <section class="container mx-auto">

      <div class="mb-4 p-4 bg-gray-700 bg-opacity-50 rounded flex-1">
        <div class="px-6 py-4">
          <h1 class="font-bold text-xl mb-2">Liste des discutions</h1>
          <div class="text-base">

            <div class="mt-4 mb-4 w-full bg-gray-700 rounded-lg shadow-lg">
              <ul class="divide-y-2 divide-gray-600">
                <li v-for="(chat, index) in chatList" :key="index" class="p-3 rounded-lg hover:bg-gray-600 hover:text-gray-200">
                  {{ chatUtils.getChatTitle(chat, currentUser) }}
                </li>
              </ul>
          </div>

          </div>
        </div>
      </div>

    </section>

    <div class="fixed bottom-10 right-10 group">
      <router-link
        :to="{ name: 'ChatCreate' }"
        class=" rounded-full h-14 w-14 flex items-center justify-center no-underline hover:no-underline text-white bg-red-500"
        role="menuitem"
      >
        <i class="fas fa-plus"></i>
      </router-link>
    </div>

  </div>
</template>

<script lang="ts">
import * as chatUtils from '@/services/chatUtils';
import { useStore } from '@/store';
import Channel, { DEFAULT_CHANNEL } from '@/types/Channel';
import { DEFAULT_CHANNEL_MEMBER } from '@/types/ChannelMember';
import { DEFAULT_USER } from '@/types/User';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatList',
  setup() {
    const store = useStore();

    const currentUser = computed(() => store.getUser);

    const chatList: Channel[] = [];

    chatList.push({
      ...DEFAULT_CHANNEL,
      id: 1,
      ownerId: 1,
      members: [
        {
          ...DEFAULT_CHANNEL_MEMBER,
          id: 1,
          userId: 1,
          user: {
            ...DEFAULT_USER,
            id: 13,
            username: 'John Deamers',
          },
        },
        {
          ...DEFAULT_CHANNEL_MEMBER,
          id: 2,
          userId: 2,
          user: {
            ...DEFAULT_USER,
            id: 2,
            username: 'pkevin',
          },
        },
      ],
    });

    chatList.push({
      ...DEFAULT_CHANNEL,
      id: 2,
      ownerId: 2,
      members: [
        {
          ...DEFAULT_CHANNEL_MEMBER,
          id: 2,
          userId: 2,
          user: {
            ...DEFAULT_USER,
            id: 2,
            username: 'pkevin',
          },
        },
        {
          ...DEFAULT_CHANNEL_MEMBER,
          id: 1,
          userId: 1,
          user: {
            ...DEFAULT_USER,
            id: 13,
            username: 'John Deamers',
          },
        },
      ],
    });

    return {
      currentUser,
      chatList,
      chatUtils,
    };
  },
});
</script>

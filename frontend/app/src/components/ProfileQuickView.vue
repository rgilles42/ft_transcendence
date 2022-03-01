<template>
  <div v-if="user">
    <div class="w-full bg-black rounded-lg sahdow-lg p-6 flex flex-col justify-center items-center">
      <div class="mb-8">
        <AccountAvatar :user="user" class="w-16 h-16 rounded-full" />
      </div>
      <div class="text-center pb-2">
        <p class="mb-2"><router-link class="text-xl text-white font-bold hover:no-underline" :to="{ name: 'Profile', params: { requestUserId: user.username }}">{{ user.username }}</router-link></p>
        <p v-if="user.activity" class="text-base text-gray-400 font-normal">{{ user.activity }}</p>
      </div>
      <button @click="sendPrivateMessage" class="btn bg-green-900 p-2 rounded-sm text-white mb-2">Envoyer un message</button>
      <button class="btn bg-orange-900 p-2 rounded-sm text-white">Provoquer en duel !</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/types/User';
import api from '@/api';
import { useRouter } from 'vue-router';
import AccountAvatar from './AccountAvatar.vue';

export default defineComponent({
  name: 'ProfileQuickView',
  components: { AccountAvatar },
  props: {
    user: Object as () => User,
  },
  setup(props) {
    const router = useRouter();
    const sendPrivateMessage = () => {
      if (!props.user) {
        return;
      }
      api.channels.requestAccessPrivate(props.user.id)
        .then((response) => {
          router.push({ name: 'ChatId', params: { requestChatId: response.data.id } });
        });
    };

    return {
      sendPrivateMessage,
    };
  },
});
</script>

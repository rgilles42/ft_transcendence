<template>
  <div v-if="message">
    <div class="chat-message">
      <div class="flex items-end" :class="[isUserMe(message.userId) ? 'justify-end' : '']">
        <div class="flex flex-col space-y-2 max-w-xs mx-2 order-2 items-end" :class="[isUserMe(message.userId) ? 'items-end' : 'items-start']">
          <div><span class="px-4 py-2 rounded-lg inline-block" :class="[isUserMe(message.userId) ? 'bg-blue-600 text-white last:rounded-br-none' : 'bg-gray-500 text-white last:rounded-bl-none']">{{ message.content }}</span></div>
        </div>
        <AccountAvatar :user="message.user" alt="avatar" class="w-8 h-8 rounded-full" :class="[isUserMe(message.userId) ? 'order-2' : ' order-1']" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChannelMessage from '@/types/ChannelMessage';
import User from '@/types/User';
import AccountAvatar from '../AccountAvatar.vue';

export default defineComponent({
  name: 'ChatMessage',
  components: {
    AccountAvatar,
  },
  props: {
    message: Object as () => ChannelMessage,
    prev: Object as () => ChannelMessage,
    me: Object as () => User | null,
  },
  setup(props) {
    const isUserMe = (userId: User['id'] | null | undefined) => {
      if (userId === undefined || userId === null) {
        return false;
      }
      return props.me && userId === props.me.id;
    };

    const isSamePerson = (message: any, prev: any) => {
      if (prev === undefined || prev === null) {
        return false;
      }
      if (prev.userId === message.userId) {
        return true;
      }
      return false;
    };

    const isSame = isSamePerson(props.message, props.prev);

    return {
      isUserMe,
      isSame,
    };
  },
});
</script>

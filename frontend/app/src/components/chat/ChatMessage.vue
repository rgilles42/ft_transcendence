<template>
  <div v-if="message" class="chat-message">
    <div class="flex items-end" :class="[userUtils.isSameUserById(me, message.userId) ? 'justify-end' : '']">
      <div class="flex flex-col space-y-2 max-w-xs mx-2 order-2 items-end" :class="[userUtils.isSameUserById(me, message.userId) ? 'items-end' : 'items-start']">
        <div><span class="px-4 py-2 rounded-lg inline-block" :class="[userUtils.isSameUserById(me, message.userId) ? 'bg-blue-600 text-white last:rounded-br-none' : 'bg-gray-500 text-white last:rounded-bl-none']">{{ message.content }}</span></div>
      </div>

      <VMenu :distance="15" :placement="isUserMe(message.userId) ? 'left-start' : 'right-start'" :positioning-disabled="screenInfo.is('all')" :class="[isUserMe(message.userId) ? 'order-2' : ' order-1']" popperClass="friend-item-quick-view">
        <AccountAvatar :user="getMemberUser(chatData, message.userId) " alt="avatar" class="w-8 h-8 rounded-full" />

        <template #popper>
          <ProfileQuickView :user="getMemberUser(chatData, message.userId)" class="" />
        </template>
      </VMenu>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChannelMessage from '@/types/ChannelMessage';
import User from '@/types/User';
import Channel from '@/types/Channel';
import * as userUtils from '@/services/userUtils';
import * as chatUtils from '@/services/chatUtils';
import { screenInfo } from '@/services/screenBreakPoint';
import AccountAvatar from '../AccountAvatar.vue';
import ProfileQuickView from '../ProfileQuickView.vue';

export default defineComponent({
  name: 'ChatMessage',
  components: {
    AccountAvatar,
    ProfileQuickView,
  },
  props: {
    chatData: Object as () => Channel,
    message: Object as () => ChannelMessage,
    prev: Object as () => ChannelMessage,
    me: {
      type: Object as () => User | null,
      default: null,
    },
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

    const getMemberUser = (chatData: Channel | undefined, userId: User['id']) => {
      const member = chatUtils.getMember(chatData, userId);
      if (!member || !member.user) {
        return undefined;
      }
      return member.user;
    };

    const isSame = isSamePerson(props.message, props.prev);

    return {
      screenInfo,
      userUtils,
      isUserMe,
      isSame,
      getMemberUser,
    };
  },
});
</script>

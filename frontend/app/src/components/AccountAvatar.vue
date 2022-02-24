<template>
  <img
    v-if="user"
    :src="avatarSrc"
    @err="emit('err', $event)"
    />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import User from '@/types/User';
// import api from '@/api';
import { configService } from '@/services/configService';

export default defineComponent({
  name: 'AccountAvatar',
  props: {
    user: Object as () => User,
  },
  setup(props, { emit }) {
    const getAvatarSrc = () => {
      if (!props.user) {
        return 'https://eu.ui-avatars.com/api/?name=John+Doe&background=random';
      }
      if (!props.user.imageUrl) {
        return `https://eu.ui-avatars.com/api/?name=${props.user.username}&background=random`;
      }
      if (props.user.imageUrl.startsWith('http')) {
        return (props.user.imageUrl);
      }
      return `${configService.getApiUrl()}/storage/${props.user.imageUrl}`;
    };

    const avatarSrc = computed(() => getAvatarSrc());

    return {
      avatarSrc,
      emit,
    };
  },
});
</script>

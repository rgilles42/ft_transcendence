<template>
  <img
    v-if="user"
    :src="avatarSrc"
    @err="emit('err', $event)"
    />
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import User from '@/types/User';
// import api from '@/api';
import { configService } from '@/services/configService';

export default defineComponent({
  name: 'AccountAvatar',
  props: {
    user: Object as () => User,
  },
  setup(props, { emit }) {
    const getAvatarSrc = (user: User) => {
      if (!user) {
        return 'https://eu.ui-avatars.com/api/?name=John+Doe&background=random';
      }
      if (!user.imageUrl) {
        return `https://eu.ui-avatars.com/api/?name=${user.username}&background=random`;
      }
      if (user.imageUrl.startsWith('http')) {
        return (user.imageUrl);
      }
      return `${configService.getApiUrl()}/storage/${user.imageUrl}`;
    };

    const avatarSrc = ref('');

    watch(
      () => props.user,
      () => {
        if (props.user) {
          avatarSrc.value = getAvatarSrc(props.user);
        }
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true },
    );

    return {
      avatarSrc,
      emit,
    };
  },
});
</script>

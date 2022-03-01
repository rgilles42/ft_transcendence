<template>
  <img
    v-if="user && !isRefreshing"
    :src="avatarSrc"
    @error="emitError"
    />
</template>

<script lang="ts">
import {
  defineComponent, watch, ref, computed,
} from 'vue';
import User from '@/types/User';
import { configService } from '@/services/configService';
import { useStore } from '@/store';

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

    const emitError = ($event: Event) => {
      emit('error', $event);
    };

    const store = useStore();

    const isRefreshing = computed(() => store.getRefreshStatus);

    return {
      isRefreshing,
      avatarSrc,
      emitError,
    };
  },
});
</script>

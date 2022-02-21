<template>
  <img
    v-if="user"
    :src="avatarUrl"
    @err="$emit('err', $event)"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/types/User';

export default defineComponent({
  name: 'AccountAvatar',
  props: {
    user: Object as () => User,
  },
  computed: {
    avatarUrl() {
      if (!this.user) {
        return 'https://eu.ui-avatars.com/api/?name=John+Doe&background=random';
      }
      if (!this.user.imageUrl) {
        return `https://eu.ui-avatars.com/api/?name=${this.user.username}&background=random`;
      }
      return (this.user.imageUrl);
    },
  },
});
</script>

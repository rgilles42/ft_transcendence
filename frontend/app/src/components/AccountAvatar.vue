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
    user: User,
  },
  computed: {
    avatarUrl() {
      if (!this.user) return 'https://eu.ui-avatars.com/api/?name=John+Doe&background=random';
      if (!this.user.avatar_urls || !this.user.avatar_urls.m) return `https://eu.ui-avatars.com/api/?name=${this.user.username}&background=random`;
      return this.user.avatar_urls.m;
    },
  },
});
</script>

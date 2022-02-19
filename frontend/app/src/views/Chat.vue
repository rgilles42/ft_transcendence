<template>
  <div>
    <ChatBox />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
} from 'vue';
import ChatBox from '@/components/ChatBox.vue';

export default defineComponent({
  name: 'Profile',
  components: { ChatBox },
});
</script>

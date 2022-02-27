<template>
  <div class="flex sm:items-center justify-between py-3 border-b border-gray-700">
    <div class="flex items-center space-x-4">
      <div class="flex flex-col leading-tight">
          <div class="text-2xl mt-1 flex items-center">
            <span class="mr-3">{{ chatTitle }}</span>
          </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatHeader',
  props: {
    chatTitle: String,
  },
});
</script>

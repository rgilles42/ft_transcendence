<template>
  <li
    @click="onClick"
    :class="[isActive ? 'text-white border-b-2 border-blue-500' : 'text-gray-500 hover:text-red-400' ]"
    class="flex items-center justify-center flex-grow text-center no-underline hover:no-underline cursor-pointer border-transparent uppercase tracking-wide font-bold text-xs py-3 transition"
  >
    <slot name="icon"></slot>
    <slot>{{ title }}</slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Tab',
  props: {
    title: String,
    isActive: Boolean,
  },
  setup(_, { emit }) {
    const onClick = (event: MouseEvent) => {
      emit('click', event);
    };
    return {
      onClick,
    };
  },
});
</script>

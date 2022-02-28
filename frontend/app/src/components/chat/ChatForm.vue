<template>
  <div class="flex items-center justify-between px-3 border-t border-gray-700">
    <input
      type="text"
      placeholder="Message"
      v-model.trim="newMessageContent"
      @keyup.enter="submitMessage"
      :disabled="disabled"
      :class="[disabled ? 'pointer-events-none' : '']"
      class="block w-full py-2 pl-4 m-3 rounded-full focus:outline-none"
    />
      <button
        type="submit"
        @click="submitMessage"
        :disabled="disabled"
        :class="[disabled ? 'pointer-events-none bg-gray-500' : 'bg-blue-500 hover:bg-blue-400']"
        class="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-white focus:outline-none"
      >
        <i class="fa-solid fa-paper-plane"></i>
      </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ChatForm',
  props: {
    disabled: Boolean,
  },
  setup(props, { emit }) {
    const newMessageContent = ref('');

    const submitMessage = () => {
      if (props.disabled) return;

      if (newMessageContent.value.length > 0) {
        emit('submitMessage', newMessageContent.value);
        newMessageContent.value = '';
      }
    };

    return {
      newMessageContent,
      submitMessage,
    };
  },
});
</script>

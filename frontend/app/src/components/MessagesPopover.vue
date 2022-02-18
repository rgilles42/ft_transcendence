<template>
  <div v-if="user">
    <Popover as="div" class="">

      <PopoverButton class="flex items-center px-1 text-sm transition duration-150 ease-in-out bg-gray-800 border-2 border-gray-700 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-solid">
        <div class="w-6 h-6 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-comment fa-lg"></i>
        </div>
      </PopoverButton>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
      <PopoverPanel class="absolute transform -translate-x-1/2 py-1 rounded-md shadow-xs bg-gray-800">
        <ul>
          <li class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Jean michel</li>
          <li class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Jean michel 2</li>
          <li class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Jean michel 3</li>
        </ul>
      </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/types/User';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';

export default defineComponent({
  components: {
    Popover, PopoverButton, PopoverPanel,
  },
  props: {
    user: Object as () => User,
  },
});
</script>

<template>
  <div v-if="user">
    <VDropdown popperClass="dropdown-messages">
      <!-- This will be the popover reference (for the events and position) -->
      <button class="flex items-center px-1 text-sm transition duration-150 ease-in-out bg-gray-800 border-2 border-gray-700 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-solid">
        <div class="w-6 h-6 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-comment fa-lg"></i>
        </div>
      </button>

      <!-- This will be the content of the popover -->
      <template #popper>
        <div class="py-1 rounded-md shadow-xs bg-gray-800">
          <ul>
            <li v-close-popper class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Jean michel</li>
            <li v-close-popper class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Jean michel 2</li>
            <li v-close-popper class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Jean michel 3</li>
          </ul>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/types/User';

export default defineComponent({
  name: 'MessagePopover',
  props: {
    user: Object as () => User,
  },
});
</script>

<style>

.dropdown-messages.v-popper__popper .v-popper__arrow-container {
  display: none;
}
.dropdown-messages.v-popper__popper {
  z-index: 999999 !important;
}

.dropdown-messages.v-popper__popper .v-popper__inner {
  border: none !important;
  border-radius: unset !important;
  background: unset !important;
}

.dropdown-messages.v-popper__popper .v-popper__wrapper {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 100ms;
}

.dropdown-messages.v-popper__popper.v-popper__popper--show-from .v-popper__wrapper {
  opacity: 0;
  transform: scale(.95);
}

.dropdown-messages.v-popper__popper.v-popper__popper--show-to .v-popper__wrapper {
  opacity: 100;
  transform: scale(1);
}

.dropdown-messages.v-popper__popper.v-popper__popper--hidden-from .v-popper__wrapper {
  opacity: 100;
  transform: scale(1);
}

.dropdown-messages.v-popper__popper.v-popper__popper--hidden-to .v-popper__wrapper {
  opacity: 0;
  transform: scale(.95);
}

</style>

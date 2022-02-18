<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div v-if="user">
    <Menu as="div" class="">
      <div>
        <MenuButton class="flex items-center pr-3 text-sm transition duration-150 ease-in-out bg-gray-800 border-2 border-gray-700 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-solid">
          <AccountAvatar :user="user" class="w-6 h-6 mr-2 rounded-full" />
          {{ user.username }}
        </MenuButton>
      </div>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems class="py-1 rounded-md shadow-xs bg-gray-800">
          <MenuItem>
            <router-link to="/profile/me" class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Profil</router-link>
          </MenuItem>
          <MenuItem>
            <router-link to="/logout" class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Déconnexion</router-link>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  Menu, MenuButton, MenuItem, MenuItems,
} from '@headlessui/vue';
import User from '@/types/User';
import AccountAvatar from './AccountAvatar.vue';

export default defineComponent({
  name: 'NavbarDropdownUser',
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    AccountAvatar,
  },
  props: {
    user: Object as () => User,
  },
});
</script>

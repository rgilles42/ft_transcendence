<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div v-if="user">

    <VDropdown popperClass="dropdown-user">
      <button class="flex items-center pr-3 text-sm transition duration-150 ease-in-out bg-gray-800 border-2 border-gray-700 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-solid">
        <AccountAvatar :user="user" class="w-6 h-6 mr-2 rounded-full" />
        {{ user.username }}
      </button>

      <template #popper>
        <div class="py-1 rounded-md shadow-xs bg-gray-800">
          <router-link v-close-popper :to="{ name: 'MyProfile' }" class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Profil</router-link>
          <router-link v-close-popper :to="{ name: 'Logout' }" class="nav-link block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Déconnexion</router-link>
        </div>
      </template>
    </VDropdown>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import User from '@/types/User';
import AccountAvatar from './AccountAvatar.vue';

export default defineComponent({
  name: 'NavbarDropdownUser',
  components: { AccountAvatar },
  props: {
    user: Object as () => User,
  },
});
</script>

<style lang="postcss">

.dropdown-user.v-popper__popper .v-popper__arrow-container {
  display: none;
}
.dropdown-user.v-popper__popper {
  z-index: 999999 !important;
}

.dropdown-user.v-popper__popper .v-popper__inner {
  border: none !important;
  border-radius: unset !important;
  background: unset !important;
}

.dropdown-user.v-popper__popper.v-popper__popper--show .v-popper__wrapper {
  @apply transition duration-200 ease-out;
}

.dropdown-user.v-popper__popper.v-popper__popper--show-from .v-popper__wrapper {
  @apply translate-y-1 opacity-0;
}

.dropdown-user.v-popper__popper.v-popper__popper--show-to .v-popper__wrapper {
  @apply translate-y-0 opacity-100;
}

.dropdown-user.v-popper__popper.v-popper__popper--hidden  .v-popper__wrapper {
  @apply transition duration-150 ease-in;
}

.dropdown-user.v-popper__popper.v-popper__popper--hidden-from .v-popper__wrapper {
  @apply translate-y-0 opacity-100;
}

.dropdown-user.v-popper__popper.v-popper__popper--hidden-to .v-popper__wrapper {
  @apply translate-y-1 opacity-0;
}

</style>

<template>
<div>
  <header class="fixed top-0 w-full flex bg-gray-900" style="height: 50px;">
    <!-- Computer -->
    <div class="hidden md:flex w-full mx-6 my-3">
      <div class="w-1/3 mr-auto flex flex-row nav-links">
        <router-link to="/" class="nav-link">Accueil</router-link>
      </div>

      <div class="w-1/3 ml-auto flex flex-row-reverse nav-links">
        <template v-if="!currentUser">
          <router-link to="/login" class="nav-link">Connexion</router-link>
        </template>
        <template v-else>
          <NavbarDropdownUser :user="currentUser" />
          <MessagesPopover :user="currentUser" class="nav-link" />
        </template>
      </div>
    </div>

    <!-- Mobile -->
    <div class="md:hidden container mx-auto flex w-full mx-6 my-3">
      <div class="w-1/3 mr-auto flex flex-row nav-links">

        <button class="text-white relative ml-10 mr-10 w-6 focus:outline-none" @click="toggleSidebar()">
          <span class="sr-only">Open main menu</span>
          <div class="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
            <span aria-hidden="true" class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out" :class="{'rotate-45': sidebarOpen,' -translate-y-1.5': !sidebarOpen }"></span>
            <span aria-hidden="true" class="block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out" :class="{'opacity-0': sidebarOpen } "></span>
            <span aria-hidden="true" class="block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out" :class="{'-rotate-45': sidebarOpen, ' translate-y-1.5': !sidebarOpen}"></span>
          </div>
        </button>
      </div>

      <div class="w-1/3 ml-auto flex flex-row-reverse nav-links">
        <template v-if="!currentUser">
          <router-link to="/login" class="nav-link">Connexion</router-link>
        </template>
        <template v-else>
          <NavbarDropdownUser :user="currentUser" />
          <MessagesPopover :user="currentUser" class="nav-link" />
        </template>
      </div>
    </div>

  </header>

  <NavigationSidebar v-model="sidebarOpen" style="padding-top: 50px;" />

</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from '@/store';
import NavbarDropdownUser from './NavbarDropdownUser.vue';
import NavigationSidebar from './NavigationSidebar.vue';
import MessagesPopover from './MessagesPopover.vue';

export default defineComponent({
  name: 'Navbar',
  components: { NavbarDropdownUser, NavigationSidebar, MessagesPopover },
  setup() {
    const store = useStore();
    return {
      currentUser: computed(() => store.getUser),
      sidebarOpen: ref(false),
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
});
</script>

<style scoped>
  header {
    z-index: 999999;
    white-space: nowrap;
  }
</style>

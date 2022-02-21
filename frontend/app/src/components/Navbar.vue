<template>
<div>
  <header class="fixed top-0 w-full flex bg-gray-900" style="height: 50px;">

    <!-- Mobile -->
    <div v-if="screenInfo.is('all', 'sm')" class="md:hidden container mx-auto flex w-full mx-6 my-3">
      <div class="w-1/3 mr-auto flex flex-row nav-links">

        <button class="text-white relative ml-10 mr-10 w-6 focus:outline-none" @click="toggleSidebar()">
          <span class="sr-only">Open main menu</span>
          <div class="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
            <span aria-hidden="true" class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out" :class="{'rotate-45': isSidebarOpen,' -translate-y-1.5': !isSidebarOpen }"></span>
            <span aria-hidden="true" class="block absolute  h-0.5 w-5 bg-current transform transition duration-500 ease-in-out" :class="{'opacity-0': isSidebarOpen } "></span>
            <span aria-hidden="true" class="block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out" :class="{'-rotate-45': isSidebarOpen, ' translate-y-1.5': !isSidebarOpen}"></span>
          </div>
        </button>
      </div>

      <div class="w-1/3 ml-auto flex flex-row-reverse nav-links">
        <template v-if="!currentUser">
          <router-link to="/auth/login" class="nav-link">Connexion</router-link>
        </template>
        <template v-else>
          <NavbarDropdownUser :user="currentUser" />
          <MessagesPopover :user="currentUser" class="nav-link" />

          <button @click="toggleSlide" class="flex items-center px-1 text-sm transition duration-150 ease-in-out bg-gray-800 border-2 border-gray-700 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-solid">
            <div class="w-6 h-6 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-users"></i>
            </div>
          </button>

        </template>
      </div>
    </div>

    <!-- Computer -->
    <div v-else class="hidden md:flex w-full mx-6 my-3">
      <div class="w-1/3 mr-auto flex flex-row nav-links">
        <router-link to="/" class="nav-link">Accueil</router-link>
      </div>

      <div class="w-1/3 ml-auto flex flex-row-reverse nav-links">
        <template v-if="!currentUser">
          <router-link to="/auth/login" class="nav-link">Connexion</router-link>
        </template>
        <template v-else>
          <NavbarDropdownUser :user="currentUser" />
          <MessagesPopover :user="currentUser" class="nav-link" />

          <button @click="toggleSlide" class="flex items-center px-1 text-sm transition duration-150 ease-in-out bg-gray-800 border-2 border-gray-700 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-solid">
            <div class="w-6 h-6 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-users"></i>
            </div>
          </button>

        </template>
      </div>
    </div>

  </header>

  <NavigationSidebar v-model="isSidebarOpen" style="margin-top: 50px;" />
  <FriendSlideOver v-model="isSlideOpen" style="margin-top: 50px;" />

</div>
</template>

<script lang="ts">
import { screenInfo } from '@/services/screenBreakPoint';
import { defineComponent, ref, computed } from 'vue';
import { useStore } from '@/store';
import NavbarDropdownUser from './NavbarDropdownUser.vue';
import NavigationSidebar from './NavigationSidebar.vue';
import MessagesPopover from './MessagesPopover.vue';
import FriendSlideOver from './FriendSlideOver.vue';

export default defineComponent({
  name: 'Navbar',
  components: {
    NavbarDropdownUser, NavigationSidebar, MessagesPopover, FriendSlideOver,
  },
  setup() {
    const store = useStore();

    return {
      currentUser: computed(() => store.getUser),
      isSidebarOpen: ref(false),
      isSlideOpen: ref(false),
      screenInfo,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    toggleSlide() {
      this.isSlideOpen = !this.isSlideOpen;
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

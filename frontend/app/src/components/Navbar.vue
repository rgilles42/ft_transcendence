<template>
  <header class="fixed top-0 w-full flex bg-gray-900" style="height: 50px;">
    <div class="hidden lg:flex w-full mx-6 my-3">
      <div class="w-1/3 mr-auto flex flex-row nav-links">
        <router-link to="/" class="nav-link">Accueil</router-link>
      </div>

      <div class="w-1/3 ml-auto flex flex-row-reverse nav-links">
        <template v-if="!currentUser">
          <router-link to="/login" class="nav-link">Connexion</router-link>
        </template>
        <NavbarDropdownUser v-else :user="currentUser" />
      </div>
    </div>
    <!-- Tablet -->
    <div class="hidden lg:hidden md:flex container mx-auto my-3 justify-center">
      <div class="w-1/3 mr-auto flex flex-row nav-links">
        <router-link to="/" class="nav-link">Accueil</router-link>
      </div>

      <div class="w-1/3 ml-auto flex flex-row-reverse nav-links">
        <template v-if="!currentUser">
          <router-link to="/login" class="nav-link">Connexion</router-link>
        </template>
        <NavbarDropdownUser v-else :user="currentUser" />
      </div>
    </div>
    <!-- Mobile -->
    <div class="md:hidden flex container mx-auto justify-center">
      <router-link class="mt-3" to="/">
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import NavbarDropdownUser from './NavbarDropdownUser.vue';

export default defineComponent({
  name: 'Navbar',
  components: { NavbarDropdownUser },
  setup() {
    const store = useStore();
    return {
      currentUser: computed(() => store.getUser),
    };
  },
});
</script>

<style scoped>
  header {
    z-index: 999999;
    white-space: nowrap;
  }
</style>

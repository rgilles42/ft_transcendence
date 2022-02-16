<template>
  <div class="block md:hidden">
    <header class="fixed h-full transform transition-transform duration-200 ease-in-out" :class="[(sidebarOpen ? 'translate-x-0' : '-translate-x-full')]">

        <!-- Sidebar -->
        <div id="sidebar" ref="sidebar" :class="[(sidebarOpen ? 'translate-x-0' : '-translate-x-full')]" class="transform transition-transform absolute z-40 left-0 top-0 static left-auto top-auto h-screen overflow-y-auto overflow-y-auto no-scrollbar w-72 flex-shrink-0 bg-gray-800 pt-4 pb-24">
          <!-- Sidebar Header -->
          <!-- <div class="flex justify-center pr-3 sm:px-2">

          </div> -->

          <!-- Links -->
          <div>

            <ul class="mt-3">

              <li class="py-1 rounded-sm mb-0.5 last:mb-0">
                <router-link
                  to="/"
                  class="nav-link m-0 block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                  role="menuitem"
                >
                  <div class="flex flex-grow">
                    <span class="flex-shrink-0 h-6 w-6 mr-3">
                      <i class="fas fa-undo ml-1"></i>
                    </span>
                    <span class="text-sm font-medium">Accueil</span>
                  </div>
                </router-link >
              </li>

            </ul>

          </div>

        </div>
      </header>
      <transition name="fade">
        <div v-if="sidebarOpen" id="sidebar-overlay" @click="sidebarOpen = false" class="fixed inset-0"></div>
      </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'NavigationSidebar',
  props: {
    modelValue: Boolean,
  },
  setup(props, { emit }) {
    const sidebarStatus = ref(props.modelValue);
    const sidebarOpen = computed({
      get: () => sidebarStatus.value,
      set: (value) => {
        emit('update:modelValue', value);
        sidebarStatus.value = value;
      },
    });
    return {
      sidebarOpen,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
  watch: {
    modelValue: {
      handler() {
        this.sidebarOpen = this.modelValue;
      },
    },
  },
});
</script>

<style scoped>
  header {
    z-index: 999999;
  }
  #sidebar-overlay {
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

</style>

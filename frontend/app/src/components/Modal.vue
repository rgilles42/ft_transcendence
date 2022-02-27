<template>
  <div>
    <div
    class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
    :class="[isOpen ? '': 'opacity-0 pointer-events-none']"
    >
      <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" @click="toggleModal"></div>

      <div class="modal-container bg-gray-800 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">

        <div
          class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-lg z-50"
          @click="toggleModal"
        >
          <i class="fa-solid fa-xmark"></i>
        </div>

        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <slot v-bind:toggleModal="toggleModal" v-bind:isOpen="isOpen">
          <div class="modal-content py-4 text-left px-6">
            <!--Header-->
            <slot name="header" v-bind:toggleModal="toggleModal" v-bind:isOpen="isOpen">
              <div class="flex justify-between items-center pb-3">
                <p class="text-lg font-bold">
                  <slot name="title" v-bind:toggleModal="toggleModal" v-bind:isOpen="isOpen"></slot>
                </p>
                <div class="modal-close cursor-pointer z-50" @click="toggleModal">
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </div>
            </slot>

            <!--Body-->
            <slot name="content" v-bind:toggleModal="toggleModal" v-bind:isOpen="isOpen"></slot>

            <!--Footer-->
            <slot name="footer" v-bind:toggleModal="toggleModal" v-bind:isOpen="isOpen">
              <div class="pt-2 block sm:flex justify-between text-center">
                <slot name="actions" v-bind:toggleModal="toggleModal" v-bind:isOpen="isOpen"></slot>
              </div>
            </slot>
          </div>
        </slot>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Modal',
  props: {
    openStatus: Boolean,
  },
  setup(props, { emit }) {
    const isOpen = ref(props.openStatus);

    watch(
      () => props.openStatus,
      () => {
        isOpen.value = props.openStatus;
        if (isOpen.value) {
          emit('open', isOpen.value);
        } else {
          emit('close', isOpen.value);
        }
      },
      { immediate: true },
    );

    const toggleModal = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        emit('open', isOpen.value);
      } else {
        emit('close', isOpen.value);
      }
    };

    return {
      isOpen,
      toggleModal,
    };
  },
});
</script>

<style scoped>
  .modal {
    transition: opacity 0.25s ease;
    z-index: 999999999;
  }
</style>

<template>
  <div>
    <header class="fixed h-full right-0 transform transition-transform duration-200 ease-in-out" :class="[(isSlideOpen ? 'translate-x-0' : 'translate-x-full')]">

      <!-- slider -->
      <div id="slider" ref="slider" :class="[(isSlideOpen ? 'translate-x-0' : 'translate-x-full')]" class="transform transition-transform absolute z-40 right-0 top-0 static top-auto h-screen overflow-y-auto no-scrollbar w-72 flex-shrink-0 bg-gray-800 pt-4 pb-24">
        <!-- slider Header -->

        <!-- Links -->
        <div class="text-sm flex-none px-3 py-3">

          <template v-for="(group, groupIndex) in groupedFriends" :key="groupIndex">
            <h3 class="uppercase tracking-wide font-semibold text-xs text-gray-500">{{ translateGroupIndex(group[0]) }} — {{ group[1].length }}</h3>

            <ul class="mb-3 truncate">
              <li v-for="(friend, friendIndex) in group[1]" :key="friendIndex" class="py-1 rounded-sm mb-0.5 last:mb-0 group relative">

              <VMenu :distance="15" placement="left-start" :positioning-disabled="screenInfo.is('all')" class="friend-item" popperClass="friend-item-quick-view" :triggers="['click']">
                <a href="##" class="nav-link m-0 block px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-700 focus:outline-none focus:bg-gray-700">
                  <div class="flex items-center">
                    <span class="flex-none"><AccountAvatar :user="friend" alt="avatar" class="w-8 h-8 mr-2 rounded-full" /></span>
                    <div class="ml-2">
                      <div>{{ friend.username }}</div>
                      <div v-if="friend.activity" class="text-xxs text-gray-500">{{ friend.activity }}</div>
                    </div>
                  </div>
                </a>

                <template #popper>
                  <ProfileQuickView :user="friend" class="" />
                </template>
              </VMenu>

              </li>
            </ul>
          </template>

        </div>

      </div>
    </header>
    <transition name="fade">
      <div v-if="isSlideOpen" id="slider-overlay" @click="isSlideOpen = false" class="fixed inset-0"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { screenInfo } from '@/services/screenBreakPoint';
import { getUserFriends } from '@/services/userUtils';
import { useStore } from '@/store';
import {
  defineComponent, ref, computed, watch,
} from 'vue';
import AccountAvatar from './AccountAvatar.vue';
import ProfileQuickView from './ProfileQuickView.vue';

export default defineComponent({
  name: 'FriendSlideOver',
  props: {
    modelValue: Boolean,
  },
  setup(props, { emit }) {
    const slideStatus = ref(props.modelValue);
    const isSlideOpen = computed({
      get: () => slideStatus.value,
      set: (value) => {
        emit('update:modelValue', value);
        slideStatus.value = value;
      },
    });
    const store = useStore();
    const currentUser = computed(() => store.getUser);

    const friends = computed(() => getUserFriends(currentUser.value));

    function groupBy<T>(list: T[], keyGetter: (x: T) => unknown) {
      const map = new Map();
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    }

    const groupedFriends = computed(() => groupBy(friends.value, (friend) => friend.status));
    return {
      currentUser,
      isSlideOpen,
      friends,
      groupedFriends,
      screenInfo,
    };
  },
  methods: {
    toggleSlide() {
      this.isSlideOpen = !this.isSlideOpen;
    },
    translateGroupIndex(index: number) {
      const indexes: string[] = [
        'En jeu',
        'En ligne',
        'Hors ligne',
      ];
      return indexes[index || 0];
    },
  },
  watch: {
    modelValue: {
      handler() {
        this.isSlideOpen = this.modelValue;
      },
    },
  },
  components: { AccountAvatar, ProfileQuickView },
});
</script>

<style>

.friend-item.v-popper {
  width: inherit !important;
}

.friend-item-quick-view.v-popper__popper .v-popper__arrow-container {
  display: none;
}

.friend-item-quick-view.v-popper__popper {
  z-index: 999999 !important;
}

.friend-item-quick-view.v-popper__popper .v-popper__inner {
  border: none !important;
  border-radius: unset !important;
  background: unset !important;
}

.friend-item-quick-view.v-popper__popper.v-popper__popper--no-positioning {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.friend-item-quick-view.v-popper__popper.v-popper__popper--no-positioning .v-popper__backdrop {
  display: block;
  background: rgba(0 0 0 / 50%);
}

.friend-item-quick-view.v-popper__popper.v-popper__popper--no-positioning .v-popper__wrapper {
  width: 100%;
  pointer-events: auto;
  transition: transform .15s ease-out;
  margin-top: 50px;
}

.friend-item-quick-view.v-popper__popper.v-popper__popper--no-positioning.v-popper__popper--hidden .v-popper__wrapper {
  transform: translateY(100%);
}

</style>

<style scoped>
  header {
    z-index: 999998;
  }
  #slider-overlay {
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

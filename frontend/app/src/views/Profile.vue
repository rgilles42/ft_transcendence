<template>
  <div class="mb-8">
    <template v-if="!user">
      <Loader></Loader>
    </template>
    <section v-else class="container mx-auto">
      <div class="flex flex-col lg:flex-row md:flex-row items-center md:ml-12 mt-8">
        <AccountAvatar :user="user" class="mb-4 md:mb-0 rounded-full w-24 md:w-16" />
        <div class="md:ml-8">
          <h6 v-if="isUserMe">Bonjour, {{ user.username }}!</h6>
          <h6 v-else>{{ user.username }}</h6>
        </div>
      </div>

      <div class="mt-8 flex flex-row">
        <section class="flex-grow mx-4">
          <div class="rounded-md bg-gray-900 text-sm">
            <div class="p-4 bg-white bg-opacity-5 border-b border-gray-800 flex justify-between items-center">
              <h4 class="text-xl">Détails du compte</h4>

              <button v-if="!isUserIsFriend" @click="sendFriendRequest(user.id)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                Envoyer une demande d'ami
              </button>

            </div>
            <div class="p-4 flex mb-4">
              <div class="w-1/3">
                <p class="text-gray-400 mb-1">Date de création:</p>
                <p>Le {{ formater.formatDate(user.createdAt, 'dd/MM/yyyy à HH:mm') }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, computed, watch,
} from 'vue';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import api from '@/api';
import User from '@/types/User';
import AccountAvatar from '@/components/AccountAvatar.vue';
import Loader from '@/components/Loader.vue';
import { AxiosResponse } from 'axios';
import formater from '@/services/formater';

export default defineComponent({
  name: 'Profile',
  components: { AccountAvatar, Loader },
  props: {
    requestUserId: {
      type: String,
      default: 'me',
    },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();

    const currentUser = computed(() => store.getUser);

    const user = ref<User | null>(null);

    const fetchData = (userId: string) => new Promise<User | null>((resolve) => {
      const apiMethod = ref<(() => Promise<AxiosResponse>) | ((userComplex: User['id'] | User['username']) => Promise<AxiosResponse>)>(api.users.getMyUser);

      if (userId) {
        apiMethod.value = api.users.getUserByComplex;
      } else if (!store.getUser) { // TODO: when guard is on, remove this
        resolve(null);
        return;
      }

      apiMethod.value(userId)
        .then((response: { data: User | null; }) => resolve(response.data))
        .catch(() => resolve(null));
    });

    const sendFriendRequest = (userId: User['id']) => {
      console.log(userId);
    };

    watch(
      () => props.requestUserId,
      () => {
        fetchData(props.requestUserId)
          .then((fetchUser) => {
            user.value = fetchUser;
          })
          .finally(() => {
            if (!user.value) {
              router.replace('/');
            }
          });
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true },
    );

    return {
      user,
      currentUser,
      formater,
      sendFriendRequest,
    };
  },
  computed: {
    isUserMe() {
      if (!this.user || !this.currentUser) {
        return false;
      }
      return this.user.id === this.currentUser.id;
    },
    isUserIsFriend() {
      if (!this.user || !this.currentUser) {
        return false;
      }
      if (!this.currentUser.friends) {
        return false;
      }
      return this.currentUser.friends.some((friend) => this.user && this.user.id === friend.userId);
    },
  },
});
</script>

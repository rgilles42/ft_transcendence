<template>
  <div class="mb-8">
    <template v-if="!user">
      <Loader></Loader>
    </template>
    <section v-else class="container mx-auto">
      <div class="flex flex-col lg:flex-row md:flex-row items-center md:ml-12 mt-8">
        <AccountAvatar :user="user" class="mb-4 md:mb-0 rounded-full w-24 md:w-16" />
        <div class="md:ml-8">
          <h6 v-if="isSameUser(currentUser, user)">Bonjour, {{ user.username }}!</h6>
          <h6 v-else>{{ user.username }}</h6>
        </div>
      </div>

      <div class="mt-8 flex flex-row">
        <section class="flex-grow mx-4">
          <div class="rounded-md bg-gray-900 text-sm">
            <div class="p-4 bg-white bg-opacity-5 border-b border-gray-800 flex justify-between items-center">
              <h4 class="text-xl">Détails du compte</h4>

              <button v-if="canUserBeFriend(currentUser, user)" @click="sendFriendRequest(user)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                Envoyer une demande d'ami
              </button>

              <template v-if="canUserAcceptFriend(currentUser, user)">
                <button @click="acceptFriendRequest(user)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                  Accepter la demande
                </button>
                <button @click="declineFriendRequest(user)" class="bg-red-900 hover:bg-red-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                  Refuser la demande
                </button>
              </template>

              <button v-if="isUserIsFriend(currentUser, user)" @click="deleteFriend(user)" class="bg-red-900 hover:bg-red-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                Supprimer cet ami
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
import {
  canUserAcceptFriend, canUserBeFriend, getUserFriendIndex, getUserFriend, isSameUser, isUserIsFriend,
} from '@/services/userUtils';
import UserFriend from '@/types/UserFriend';

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

    const sendFriendRequest = (newFriend: User | null) => {
      if (!currentUser.value || !newFriend || !canUserBeFriend(currentUser.value, newFriend)) {
        return;
      }
      console.log(newFriend.id);
      api.users.addUserFriend(currentUser.value.id, newFriend.id)
        .then((response) => {
          if (currentUser.value) {
            currentUser.value.friends = currentUser.value.friends || [];
            const userFriend: UserFriend = {
              id: response.data.id,
              status: response.data.status,
              userId: response.data.userId,
              friendId: response.data.friendId,
              createdAt: response.data.createdAt,
              updatedAt: response.data.updatedAt,
            };
            currentUser.value.friends.push(userFriend);
          }
        });
    };

    const acceptFriendRequest = (newFriend: User | null) => {
      if (!currentUser.value || !newFriend || !canUserAcceptFriend(currentUser.value, newFriend)) {
        return;
      }
      const userFriend = getUserFriend(currentUser.value, newFriend);
      if (!userFriend) {
        return;
      }
      api.users.updateUserFriend(userFriend.id)
        .then(() => {
          userFriend.status = true;
        });
    };

    const declineFriendRequest = (newFriend: User | null) => {
      if (!currentUser.value || !newFriend || !canUserAcceptFriend(currentUser.value, newFriend)) {
        return;
      }
      const userFriend = getUserFriend(currentUser.value, newFriend);
      if (!userFriend) {
        return;
      }
      api.users.deleteUserFriend(userFriend.id)
        .then(() => {
          const index = getUserFriendIndex(currentUser.value, user.value);
          if (index >= 0 && currentUser.value && currentUser.value.friends) {
            currentUser.value.friends.splice(index);
          }
        });
    };

    const deleteFriend = (oldFriend: User | null) => {
      if (!currentUser.value || !oldFriend || !isUserIsFriend(currentUser.value, oldFriend)) {
        return;
      }
      const userFriend = getUserFriend(currentUser.value, oldFriend);
      if (!userFriend) {
        return;
      }
      api.users.deleteUserFriend(userFriend.id)
        .then(() => {
          const index = getUserFriendIndex(currentUser.value, user.value);
          if (index >= 0 && currentUser.value && currentUser.value.friends) {
            currentUser.value.friends.splice(index);
          }
        });
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
      acceptFriendRequest,
      declineFriendRequest,
      deleteFriend,
      isUserIsFriend,
      canUserBeFriend,
      canUserAcceptFriend,
      isSameUser,
    };
  },
});
</script>

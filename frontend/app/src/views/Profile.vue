<template>
  <div class="mb-8">
    <template v-if="!user">
      <Loader></Loader>
    </template>
    <section v-else class="container mx-auto">
      <div class="flex flex-col lg:flex-row md:flex-row items-center md:ml-12 mt-8">
        <AccountAvatar :user="user" class="mb-4 md:mb-0 rounded-full w-24 md:w-16" />
        <div class="md:ml-8">
          <h6 v-if="userUtils.isSameUser(currentUser, user)">Bonjour, {{ user.username }}!</h6>
          <h6 v-else>{{ user.username }}</h6>
        </div>
      </div>

      <div class="mt-8 flex flex-row">
        <section class="flex-grow mx-4">
          <div class="rounded-md bg-gray-900 text-sm">
            <div class="p-4 bg-white bg-opacity-5 border-b border-gray-800 flex justify-between items-center">
              <h4 class="text-xl">Détails du compte</h4>

              <div class="block sm:flex justify-between text-center">
                <div class="sm:mr-8">
                  <button v-if="userUtils.canUserBeBlocked(currentUser, user)" @click="blockUser(user)" class="bg-orange-900 hover:bg-orange-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                    Bloquer cet utilisateur
                  </button>
                  <button v-if="userUtils.isUserIsBlocked(currentUser, user)" @click="unBlockUser(user)" class="bg-orange-900 hover:bg-orange-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                    Débloquer cet utilisateur
                  </button>
                </div>
                <div>
                  <button v-if="userUtils.canUserBeFriend(currentUser, user)" @click="sendFriendRequest(user)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                    Envoyer une demande d'ami
                  </button>
                  <template v-if="userUtils.canUserAcceptFriend(currentUser, user)" class="space-x-4 flex">
                    <button @click="acceptFriendRequest(user)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider sm:mr-4">
                      Accepter la demande
                    </button>
                    <button @click="declineFriendRequest(user)" class="bg-red-900 hover:bg-red-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                      Refuser la demande
                    </button>
                  </template>
                  <button v-if="userUtils.isUserIsFriend(currentUser, user)" @click="deleteFriend(user)" class="bg-red-900 hover:bg-red-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                    Supprimer cet ami
                  </button>
                </div>
              </div>
            </div>
            <div class="p-4 flex mb-4">
              <div class="w-1/3">
                <p class="text-gray-400 mb-1">Date de création:</p>
                <p>Le {{ formater.formatDate(user.createdAt, 'dd/MM/yyyy à HH:mm') }}</p>
              </div>
            </div>
          </div>

          <Tabs v-if="userUtils.isSameUser(currentUser, user)" defaultActiveTab="information" class="rounded-md bg-gray-900 text-sm">
            <template v-slot:tabs="{ activeTab, clickTab }">
              <div class="bg-white bg-opacity-5 border-b border-gray-800 block sm:flex w-full flex-between">
                <Tab :isActive="activeTab === 'information'" @click="clickTab('information')">
                  <i class="fa-solid fa-address-card mr-2"></i>
                  Informations Personnelles
                </Tab>
                <Tab :isActive="activeTab === 'editProfile'" @click="clickTab('editProfile')">
                  <i class="fa-solid fa-user-gear mr-2"></i>
                  Modifier le profil
                </Tab>
              </div>
            </template>

            <template v-slot:default="{ activeTab }">
              <section class="p-4 mb-4">
                <div v-if="activeTab === 'information'">
                  Voici mon profil
                </div>
                <template v-if="activeTab === 'editProfile'">
                  <div>
                    <div class="mb-6">
                      <input v-model.trim="editProfileData.username" type="text" placeholder="Nom d'utilisateur" class="block w-full py-2 m-0 pl-4 rounded-full focus:outline-none">
                    </div>
                    <div class="mb-6">
                      <input @change="onImgChange" ref="newAvatarInput" type="file" accept="image/*" class="block w-full py-2 m-0 pl-4 rounded-full focus:outline-none">
                    </div>
                    <div class="mb-6">
                      <input v-model.trim="editProfileData.activity" type="text" placeholder="Message d'activité" class="block w-full py-2 m-0 pl-4 rounded-full focus:outline-none">
                    </div>
                    <div class="flex">
                      <button @click="editProfile(user, editProfileData)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none w-full p-2 text-xs rounded-full uppercase font-bold tracking-wider">
                        Modifier mon profil
                      </button>
                    </div>
                  </div>
                </template>
              </section>
            </template>
          </Tabs>

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
import * as formater from '@/services/formater';
import * as userUtils from '@/services/userUtils';
import UserFriend from '@/types/UserFriend';
import Tabs from '@/components/tab/Tabs.vue';
import Tab from '@/components/tab/Tab.vue';
import UserBlock from '@/types/UserBlock';

export default defineComponent({
  name: 'Profile',
  components: {
    AccountAvatar,
    Loader,
    Tabs,
    Tab,
  },
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

    // Blocked methods

    const blockUser = (newBlocked: User | null) => {
      if (!currentUser.value || !newBlocked || !userUtils.canUserBeBlocked(currentUser.value, newBlocked)) {
        return;
      }
      api.users.addUserBlocked(currentUser.value.id, newBlocked.id)
        .then((response) => {
          if (currentUser.value) {
            currentUser.value.blockedUsers = currentUser.value.blockedUsers || [];
            const userBlocked: UserBlock = {
              id: response.data.id,
              userId: response.data.userId,
              blockedId: response.data.blockedId,
              createdAt: response.data.createdAt,
            };
            currentUser.value.blockedUsers.push(userBlocked);
          }
        });
    };

    const unBlockUser = (oldBlocked: User | null) => {
      if (!currentUser.value || !oldBlocked || !userUtils.isUserIsBlocked(currentUser.value, oldBlocked)) {
        return;
      }
      const userFriend = userUtils.getUserBlocked(currentUser.value, oldBlocked);
      if (!userFriend) {
        return;
      }
      api.users.deleteUserBlocked(userFriend.id)
        .then(() => {
          const index = userUtils.getUserBlockedIndex(currentUser.value, user.value);
          if (index >= 0 && currentUser.value && currentUser.value.blockedUsers) {
            currentUser.value.blockedUsers.splice(index, 1);
          }
        });
    };

    // Friend methods

    const sendFriendRequest = (newFriend: User | null) => {
      if (!currentUser.value || !newFriend || !userUtils.canUserBeFriend(currentUser.value, newFriend)) {
        return;
      }
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
      if (!currentUser.value || !newFriend || !userUtils.canUserAcceptFriend(currentUser.value, newFriend)) {
        return;
      }
      const userFriend = userUtils.getUserFriend(currentUser.value, newFriend);
      if (!userFriend) {
        return;
      }
      api.users.updateUserFriend(userFriend.id)
        .then(() => {
          userFriend.status = true;
        });
    };

    const declineFriendRequest = (newFriend: User | null) => {
      if (!currentUser.value || !newFriend || !userUtils.canUserAcceptFriend(currentUser.value, newFriend)) {
        return;
      }
      const userFriend = userUtils.getUserFriend(currentUser.value, newFriend);
      if (!userFriend) {
        return;
      }
      api.users.deleteUserFriend(userFriend.id)
        .then(() => {
          const index = userUtils.getUserFriendIndex(currentUser.value, user.value);
          if (index >= 0 && currentUser.value && currentUser.value.friends) {
            currentUser.value.friends.splice(index, 1);
          }
        });
    };

    const deleteFriend = (oldFriend: User | null) => {
      if (!currentUser.value || !oldFriend || !userUtils.isUserIsFriend(currentUser.value, oldFriend)) {
        return;
      }
      const userFriend = userUtils.getUserFriend(currentUser.value, oldFriend);
      if (!userFriend) {
        return;
      }
      api.users.deleteUserFriend(userFriend.id)
        .then(() => {
          const index = userUtils.getUserFriendIndex(currentUser.value, user.value);
          if (index >= 0 && currentUser.value && currentUser.value.friends) {
            currentUser.value.friends.splice(index, 1);
          }
        });
    };

    // Edit profile methods

    const newAvatarInput = ref<any>(null);

    const editProfileData = ref({
      username: '',
      newAvatar: null,
      activity: '',
    });

    const onImgChange = (event: any) => {
      const { files } = event.target;
      [editProfileData.value.newAvatar] = files;
    };

    const editProfile = (editedUser: User | null, newProfileData: any) => {
      if (!editedUser) {
        return;
      }
      api.users.editUserProfile(editedUser.id, newProfileData).then((response) => {
        user.value = response.data;
        newAvatarInput.value.value = '';
        editProfileData.value.newAvatar = null;
      });
    };

    watch(
      () => props.requestUserId,
      () => {
        fetchData(props.requestUserId)
          .then((fetchUser) => {
            user.value = fetchUser;

            editProfileData.value.username = user.value?.username || '';

            editProfileData.value.activity = user.value?.activity || '';
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
      userUtils,
      // Block user
      blockUser,
      unBlockUser,
      // Friend request
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      deleteFriend,
      // Edit Profile
      editProfile,
      onImgChange,
      editProfileData,
      newAvatarInput,
    };
  },
});
</script>

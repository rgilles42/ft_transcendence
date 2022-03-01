<template>
  <div>
    <template v-if="!user">
      <Loader></Loader>
    </template>
    <section v-else class="container mx-auto">
      <div class="flex justify-around sm:justify-between items-center lg:ml-12 lg:mr-12 mt-8">
        <div class="flex flex-col lg:flex-row md:flex-row items-center">
          <AccountAvatar :user="user" class="mb-4 md:mb-0 rounded-full w-24 md:w-16" />
          <div class="md:ml-8">
            <h6 v-if="userUtils.isSameUser(currentUser, user)">Bonjour, {{ user.username }}!</h6>
            <h6 v-else>{{ user.username }}</h6>
          </div>
        </div>
        <div class="flex flex-col lg:flex-row md:flex-row items-center text-center">
          <div class="sm:mr-8">
            <button v-if="userUtils.canUserBeBlocked(currentUser, user)" @click="blockUser(user)" class="bg-orange-900 hover:bg-orange-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
              Bloquer cet utilisateur
            </button>
            <button v-if="userUtils.isUserIsBlocked(currentUser, user)" @click="unBlockUser(user)" class="bg-orange-900 hover:bg-orange-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
              Débloquer cet utilisateur
            </button>
          </div>
          <div class="flex flex-col sm:flex-row">
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

      <div class="mt-8 flex flex-row">
        <section class="flex-grow mx-4">

          <Tabs defaultActiveTab="information" class="rounded-md bg-gray-900 text-sm">
            <template v-slot:tabs="{ activeTab, clickTab }">
              <div class="bg-white bg-opacity-5 border-b border-gray-800 block sm:flex w-full flex-between">
                <Tab :isActive="activeTab === 'information'" @click="clickTab('information')">
                  <i class="fa-solid fa-address-card mr-2"></i>
                  Informations Personnelles
                </Tab>
                <Tab v-if="userUtils.isSameUser(currentUser, user)" :isActive="activeTab === 'editProfile'" @click="clickTab('editProfile')">
                  <i class="fa-solid fa-user-gear mr-2"></i>
                  Modifier le profil
                </Tab>
                <Tab v-if="userUtils.isSameUser(currentUser, user)" :isActive="activeTab === '2fa'" @click="clickTab('2fa')">
                  <i class="fa-solid fa-user-shield mr-2"></i>
                  2Fa
                </Tab>
              </div>
            </template>

            <template v-slot:default="{ activeTab }">
              <section class="p-4 mb-4">
                <div v-if="activeTab === 'information'">
                  <div class="w-1/3">
                    <p class="text-gray-400 mb-1">Date de création:</p>
                    <p>Le {{ formater.formatDate(user.createdAt, 'dd/MM/yyyy à HH:mm') }}</p>
                  </div>
                </div>
                <template v-if="userUtils.isSameUser(currentUser, user) && activeTab === 'editProfile'">
                  <form @submit.prevent="editProfile(user, editProfileData)">
                    <div class="mb-6">
                      <FormInput title="Nom d'utilisateur" placeholder="Nom d'utilisateur" v-model.trim="editProfileData.username" required />
                    </div>
                    <div class="mb-6">
                      <FormInput title="Nouvel avavtar" placeholder="Nom d'utilisateur" @change="onImgChange" ref="newAvatarInput" type="file" accept="image/*"/>
                    </div>
                    <div class="mb-6">
                      <FormInput title="Message d'activité" placeholder="Message d'activité" v-model.trim="editProfileData.activity" />
                    </div>
                    <div class="flex">
                      <button class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none w-full p-2 text-xs rounded-full uppercase font-bold tracking-wider">
                        Modifier mon profil
                      </button>
                    </div>
                  </form>
                </template>
                <template v-if="userUtils.isSameUser(currentUser, user) && activeTab === '2fa'">
                  <form v-if="user.isTwoFactorEnable === true" @submit.prevent="twoFactorDisable(twoFaCodeRef)">
                    <div class="mb-6">
                      <FormInput title="Code" placeholder="Code" name="code" v-model.trim="twoFaCodeRef" :errors="disable2FaErrors" required />
                    </div>
                    <div class="flex">
                      <button class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none w-full p-2 text-xs rounded-full uppercase font-bold tracking-wider">
                        Supprimer le 2FA
                      </button>
                    </div>
                  </form>
                  <form v-else @submit.prevent="twoFactorEnable(twoFaCodeRef)">
                    <div class="mb-6">
                      <button type="button" @click="generateNewQrCode">Générer un QR Code</button>
                      <FormInput title="Code" placeholder="Code" name="code" v-model.trim="twoFaCodeRef" :errors="enable2FaErrors" required />
                    </div>
                    <div class="flex">
                      <button class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none w-full p-2 text-xs rounded-full uppercase font-bold tracking-wider">
                        ajouter le 2FA
                      </button>
                    </div>
                  </form>
                </template>
              </section>
            </template>
          </Tabs>

        </section>
      </div>

      <div class="mt-8">
        <section class="flex-grow mx-4">

          <div class="mb-4 p-4 bg-gray-700 bg-opacity-50 rounded flex-1">
            <div class="px-6 py-4">
              <h1 class="font-bold text-xl mb-2">Historique des parties de Pong!</h1>
              <div class="text-base">
                <template v-if="!user.games">
                  <Loader />
                </template>
                <template v-else>
                  <div class="mt-4 mb-4 w-full rounded-lg overflow-auto" :class="[user.games.length <= 0 ? 'justify-center text-center flex' : 'bg-gray-700 shadow-lg']">

                    <div v-if="user.games.length <= 0">
                      <h3 class="tracking-wide font-semibold text-lg">Il n'y a aucune partie... :'(</h3>

                      <div class="py-1 mb-0.5">
                        <img src="/noOne.gif" alt="Is there anybody out there?" />
                      </div>
                    </div>
                    <table v-else class="table-auto w-full text-center">
                      <thead class="bg-gray-700">
                        <tr>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Status
                          </th>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Date
                          </th>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Joueurs
                          </th>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Scores
                          </th>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Durée
                          </th>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Map
                          </th>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Power-Up
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(game, index) in user.games" :key="index" class="border-b bg-gray-900 border-gray-700 hover:bg-gray-800">
                          <td class="py-4 px-6 text-sm whitespace-nowrap">
                            <i v-if="gameUtils.getGameWinner(game) === user?.id" class="fa-solid fa-trophy"></i>
                            <i v-else class="fa-solid fa-skull-crossbones"></i>
                          </td>
                          <td class="py-4 px-6 text-sm whitespace-nowrap">
                            {{ formater.formatDate(game.createdAt, 'dd/MM/yyyy à HH:mm') }}
                          </td>
                          <td class="py-4 px-6 text-sm whitespace-nowrap">
                            {{ game.player1?.username }} - {{ game.player2?.username }}
                          </td>
                          <td class="py-4 px-6 text-sm whitespace-nowrap">
                            {{ game.player1Score }} - {{ game.player2Score }}
                          </td>
                          <td class="py-4 px-6 text-sm whitespace-nowrap">
                            {{ formater.formatDistance(game.endAt, game.createdAt) }}
                          </td>
                          <td class="py-4 px-6 text-sm whitespace-nowrap">
                            {{ game.map ? game.map : 'Pong Original' }}
                          </td>
                          <td class="py-4 px-6 text-sm whitespace-nowrap">
                            {{ game.powerUps ? game.powerUps.join(', ') : 'Aucun' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                  </div>
                </template>
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
import * as formater from '@/services/formater';
import * as userUtils from '@/services/userUtils';
import * as gameUtils from '@/services/gameUtils';
import UserFriend from '@/types/UserFriend';
import Tabs from '@/components/tab/Tabs.vue';
import Tab from '@/components/tab/Tab.vue';
import UserBlock from '@/types/UserBlock';
import FormInput from '@/components/form/FormInput.vue';
import { configService } from '@/services/configService';

export default defineComponent({
  name: 'Profile',
  components: {
    AccountAvatar,
    Loader,
    Tabs,
    Tab,
    FormInput,
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

    const fetchUserData = (userId: string) => new Promise<User | null>((resolve) => {
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
        newAvatarInput.value.currentValue = '';
        editProfileData.value.newAvatar = null;
      });
    };

    watch(
      () => props.requestUserId,
      () => {
        fetchUserData(props.requestUserId)
          .then((fetchUser) => {
            user.value = fetchUser;

            editProfileData.value.username = user.value?.username || '';

            editProfileData.value.activity = user.value?.activity || '';
          })
          .finally(() => {
            if (!user.value) {
              router.replace({ name: 'Home' });
            }
          });
      },
      // fetch the data when the view is created and the data is
      // already being observed
      { immediate: true },
    );

    const twoFaCodeRef = ref('');
    const disable2FaErrors = ref<any>({});

    const enable2FaErrors = ref<any>({});

    const qrCodeWindow = ref<Window | null>(null);

    const generateNewQrCode = () => {
      if (qrCodeWindow.value) {
        qrCodeWindow.value.close();
      }
      qrCodeWindow.value = window.open(`${configService.getApiUrl()}/auth/2fa/generate`, 'qrcode2fa', 'width=200,height=200');
    };

    const twoFactorEnable = (login: string) => {
      disable2FaErrors.value = {};

      twoFaCodeRef.value = '';

      if (qrCodeWindow.value) {
        qrCodeWindow.value.close();
      }

      api.auth.twoFactorEnable(login)
        .then(() => {
          if (user.value) {
            user.value.isTwoFactorEnable = true;
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            disable2FaErrors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };

    const twoFactorDisable = (login: string) => {
      disable2FaErrors.value = {};

      twoFaCodeRef.value = '';

      api.auth.twoFactorDisable(login)
        .then(() => {
          if (user.value) {
            user.value.isTwoFactorEnable = false;
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            disable2FaErrors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };

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
      // Game
      gameUtils,
      // 2fa
      twoFaCodeRef,
      disable2FaErrors,
      twoFactorDisable,
      generateNewQrCode,
      enable2FaErrors,
      twoFactorEnable,
    };
  },
});
</script>

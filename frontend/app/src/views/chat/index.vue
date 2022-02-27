<template>
  <div>
    <div class="margin-navbar"></div>
    <section class="container mx-auto">

      <div class="mb-4 p-4 bg-gray-700 bg-opacity-50 rounded flex-1">
        <div class="px-6 py-4">
          <h1 class="font-bold text-xl mb-2">Liste des discutions</h1>
          <div class="text-base">

            <Modal :openStatus="modalData.isOpen" @close="closeModal()">
              <template v-slot:title>Veuillez entrer le mot de passe:</template>
              <template v-slot:content>
                <FormInput title="Mot de passe" type="password" v-model="modalData.password" :errors="modalData.errors" />
              </template>
              <template v-slot:actions>
                <button @click="closeModal()" class="bg-orange-900 hover:bg-orange-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-sm rounded-lg tracking-wider">Annuler</button>
                <button @click="closeModal(false)" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-sm rounded-lg tracking-wider">Ce connecter</button>
              </template>
            </Modal>

            <div class="mt-4 mb-4 w-full rounded-lg" :class="[chatList.length <= 0 ? 'justify-center text-center flex' : 'bg-gray-700 shadow-lg']">

              <div v-if="chatList.length <= 0">
                <h3 class="tracking-wide font-semibold text-lg">Il n'y a aucune conversation... :'(</h3>

                <div class="py-1 mb-0.5">
                  <img src="noOne.gif" alt="Is there anybody out there?" />
                </div>
              </div>
              <ul v-else class="divide-y-2 divide-gray-600">
                <li v-for="(chat, index) in chatList" :key="index" @click="onChannelClick(chat)" class="p-3 rounded-lg hover:bg-gray-600 hover:text-gray-200">
                  <template v-if="chat.password !== null">
                    <i v-if="chatUtils.isUserIsMember(chat, currentUser?.id)" class="fa-solid fa-lock-open mr-2"></i>
                    <i v-else class="fa-solid fa-lock mr-2"></i>
                  </template>
                  <i v-else class="fa-solid fa-door-open mr-2"></i>
                  {{ chatUtils.getChatTitle(chat, currentUser) }}
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

    </section>

    <div class="fixed bottom-10 right-10 group">
      <router-link
        :to="{ name: 'ChatCreate' }"
        class=" rounded-full h-14 w-14 flex items-center justify-center no-underline hover:no-underline text-white bg-red-500"
        role="menuitem"
      >
        <i class="fas fa-plus"></i>
      </router-link>
    </div>

  </div>
</template>

<script lang="ts">
import * as chatUtils from '@/services/chatUtils';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import Channel from '@/types/Channel';
import { computed, defineComponent, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import FormInput from '@/components/form/FormInput.vue';
import api from '@/api';

export default defineComponent({
  name: 'ChatList',
  components: { Modal, FormInput },
  setup() {
    const router = useRouter();
    const store = useStore();
    const currentUser = computed(() => store.getUser);

    const chatList = ref<Channel[]>([]);

    const getAllChannels = () => {
      api.channels.getChannels()
        .then((response) => {
          chatList.value = response.data;
        });
    };
    getAllChannels();

    const enterInChannel = (requestChatId: Channel['id']) => {
      router.push({ name: 'ChatId', params: { requestChatId } });
    };

    const requestEnterInChannel = (channel: Channel, password?: string) => new Promise<Channel['id']>((resolve, reject) => {
      if (!currentUser.value) {
        reject();
        return;
      }
      if (!chatUtils.isUserIsMember(channel, currentUser.value?.id)) {
        api.channels.requestEnterInChannel(channel.id, currentUser.value.id, password)
          .then(() => {
            resolve(channel.id);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } else {
        resolve(channel.id);
      }
    });

    const modalData = ref({
      password: '',
      isOpen: false,
      channel: null as Channel | null,
      errors: {},
    });

    const openModal = (channel: Channel) => {
      modalData.value.password = '';
      modalData.value.isOpen = true;
      modalData.value.channel = channel;
    };

    const closeModal = (canceled = true) => {
      if (canceled || modalData.value.channel === null) {
        modalData.value.isOpen = false;
        modalData.value.password = '';
        modalData.value.channel = null;
        return;
      }
      requestEnterInChannel(modalData.value.channel, modalData.value.password)
        .then((channelId) => {
          modalData.value.isOpen = false;
          modalData.value.password = '';
          modalData.value.channel = null;
          enterInChannel(channelId);
        })
        .catch((error) => {
          modalData.value.password = '';
          if (error.response.status === 400) {
            modalData.value.errors = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };

    const onChannelClick = (channel: Channel) => {
      if (modalData.value.isOpen && channel.password !== null) {
        return;
      }
      if (!modalData.value.isOpen && channel.password !== null && !chatUtils.isUserIsMember(channel, currentUser.value?.id)) {
        openModal(channel);
        return;
      }
      requestEnterInChannel(channel).then((channelId) => {
        enterInChannel(channelId);
      });
    };

    return {
      currentUser,
      chatList,
      chatUtils,
      // Password Secure
      onChannelClick,
      closeModal,
      modalData,
    };
  },
});
</script>

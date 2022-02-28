<template>
  <div class="mb-8" v-if="isLoad">
    <div class="margin-navbar"></div>
    <section class="container mx-auto">

      <form @submit.prevent="editChannel">
        <div class="mb-4 p-4 bg-gray-700 bg-opacity-50 rounded flex-1">

          <div class="px-6 py-4 grid md:grid-flow-col gap-4">
            <FormInput title="Nom du salon" name="title" v-model="editChannelData.title" :errors="editChannelDataErrors" :required="true" :disabled="!chatUtils.isUserIsOwner(editChannelData, currentUser?.id)" />
            <FormSelect title="Type" name="isPrivate" v-model="editChannelData.channelType" :options="channelTypes" :errors="editChannelDataErrors" required :disabled="!chatUtils.isUserIsOwner(editChannelData, currentUser?.id)"  />
            <FormInput title="Activer le mot de passe" type="checkbox" v-model="editChannelData.isPasswordEnabled" :errors="editChannelDataErrors" :disabled="editChannelData.isPrivate || !chatUtils.isUserIsOwner(editChannelData, currentUser?.id)"  />
            <FormInput title="Mot de passe" type="password" name="password" v-model="editChannelData.password" :errors="editChannelDataErrors" :disabled="!editChannelData.isPasswordEnabled || editChannelData.isPrivate || !chatUtils.isUserIsOwner(editChannelData, currentUser?.id)" />
          </div>

          <span v-if="editChannelDataErrors.global && editChannelDataErrors.global.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1">
            <li v-for="(error, index) in editChannelDataErrors.global" :key="index">{{ error }}</li>
          </span>

          <div class="px-6 py-4 grid md:grid-flow-col gap-4 text-center">
            <button
              class="p-3 w-full focus:no-border"
              :disabled="!chatUtils.isUserIsOwner(editChannelData, currentUser?.id)"
              :class="[!chatUtils.isUserIsOwner(editChannelData, currentUser?.id) ? 'pointer-events-none bg-gray-500' : 'bg-green-900 hover:bg-green-800']"
            >
            Modifier le salon de discution</button>
          </div>

        </div>
      </form>

      <Tabs defaultActiveTab="addMember" class="rounded-md bg-gray-900 text-sm">
        <template v-slot:tabs="{ activeTab, clickTab }">
          <div class="bg-white bg-opacity-5 border-b border-gray-800 block sm:flex w-full flex-between">
            <Tab :isActive="activeTab === 'addMember'" @click="clickTab('addMember')">
              <i class="fa-solid fa-user-plus mr-2"></i>
              Ajouter un membre
            </Tab>
            <Tab :isActive="activeTab === 'editMember'" @click="clickTab('editMember')">
              <i class="fa-solid fa-user-pen mr-2"></i>
              Modifier/Supprimer un membre
            </Tab>
          </div>
        </template>

        <template v-slot:default="{ activeTab }">
          <section class="p-4 mb-4">
            <template v-if="activeTab === 'addMember'">
              <form @submit.prevent="addChannelMember">
                <div class="px-6 py-4 grid md:grid-flow-col gap-4">
                  <FormInput title="Nom du nouveau membre" v-model="newChannelMemberData" :required="true"/>
                </div>

                <span v-if="newChannelMemberDataErrors.global && newChannelMemberDataErrors.global.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1">
                  <li v-for="(error, index) in newChannelMemberDataErrors.global" :key="index">{{ error }}</li>
                </span>

                <div class="px-6 py-4 grid md:grid-flow-col gap-4 text-center">
                  <button class="p-3 w-full focus:no-border bg-green-900 hover:bg-green-800">Ajouter ce membre</button>
                </div>
              </form>
            </template>
            <template v-if="activeTab === 'editMember'">
              <form @submit.prevent="editChannelMember">

                <div class="px-6 py-4 grid md:grid-flow-col gap-4">
                  <FormSelect title="Membre" v-model="editChannelMemberData" :options="editChannelData.members" required :disabled="!chatUtils.isUserIsOwner(editChannelData, currentUser?.id)">
                    <template v-slot:option="{ option }">
                      {{ getMemberName(option.userId) }}
                    </template>
                  </FormSelect>
                  <FormSelect title="Grade" v-model="editChannelMemberRoleData" :options="memberTypes" required :disabled="!chatUtils.isUserIsOwner(editChannelData, currentUser?.id)"/>
                </div>

                <span v-if="editChannelMemberRoleDataErrors.global && editChannelMemberRoleDataErrors.global.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1">
                  <li v-for="(error, index) in editChannelMemberRoleDataErrors.global" :key="index">{{ error }}</li>
                </span>

                <div class="px-6 py-4 grid md:grid-flow-col gap-4 text-center">
                  <button
                    class="p-3 w-full focus:no-border"
                    :disabled="!chatUtils.isUserIsOwner(editChannelData, currentUser?.id)"
                    :class="[!chatUtils.isUserIsOwner(editChannelData, currentUser?.id) ? 'pointer-events-none bg-gray-500' : 'bg-green-900 hover:bg-green-800']"
                  >
                  Modifier ce membre</button>
                </div>

              </form>
            </template>
          </section>
        </template>
      </Tabs>

      <Tabs defaultActiveTab="restrictMember" class="rounded-md bg-gray-900 text-sm">
        <template v-slot:tabs="{ activeTab, clickTab }">
          <div class="bg-white bg-opacity-5 border-b border-gray-800 block sm:flex w-full flex-between">
            <Tab :isActive="activeTab === 'restrictMember'" @click="clickTab('restrictMember')">
              <i class="fa-solid fa-ban mr-2"></i>
              Sanctionner un membre
            </Tab>
            <Tab :isActive="activeTab === 'deleteRestrictMember'" @click="clickTab('deleteRestrictMember')">
              <i class="fa-solid fa-trash mr-2"></i>
              Supprimer une sanction
            </Tab>
          </div>
        </template>

        <template v-slot:default="{ activeTab }">
          <section class="p-4 mb-4">
            <template v-if="activeTab === 'restrictMember'">
              <form @submit.prevent="restrictChannelMember">

                <div class="px-6 py-4 grid md:grid-flow-col gap-4">
                  <FormSelect title="Membre" v-model="restrictChannelMemberData" :options="editChannelData.members" required>
                    <template v-slot:option="{ option }">
                      {{ getMemberName(option.userId) }}
                    </template>
                  </FormSelect>
                  <FormSelect title="Sanction" v-model="restrictChannelMemberTypeData" :options="restrictTypes" required/>
                  <Datepicker v-model="restrictChannelMemberEndAtData" :dark="true" />
                </div>

                <span v-if="restrictChannelMemberDataErrors.global && restrictChannelMemberDataErrors.global.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1">
                  <li v-for="(error, index) in restrictChannelMemberDataErrors.global" :key="index">{{ error }}</li>
                </span>

                <div class="px-6 py-4 grid md:grid-flow-col gap-4 text-center">
                  <button class="p-3 w-full focus:no-border bg-green-900 hover:bg-green-800">Sanctionner ce membre</button>
                </div>

              </form>
            </template>
            <template v-if="activeTab === 'deleteRestrictMember'">
              <form @submit.prevent="deleteRestrictChannelMember">

                <div class="px-6 py-4 grid md:grid-flow-col gap-4">
                  <FormSelect title="Membre" v-model="deleteRestrictChannelMemberData" :options="editChannelData.restrictions" required>
                    <template v-slot:option="{ option }">
                      {{ getMemberName(option.userId) }} ({{ restrictTypes[option.type] }})
                    </template>
                  </FormSelect>
                </div>

                <span v-if="deleteRestrictChannelMemberDataErrors.global && deleteRestrictChannelMemberDataErrors.global.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1">
                  <li v-for="(error, index) in deleteRestrictChannelMemberDataErrors.global" :key="index">{{ error }}</li>
                </span>

                <div class="px-6 py-4 grid md:grid-flow-col gap-4 text-center">
                  <button class="p-3 w-full focus:no-border bg-green-900 hover:bg-green-800">Supprimer la sanction</button>
                </div>

              </form>
            </template>
          </section>
        </template>
      </Tabs>

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
import Channel, { DEFAULT_CHANNEL } from '@/types/Channel';
import FormSelect from '@/components/form/FormSelect.vue';
import FormInput from '@/components/form/FormInput.vue';
import * as chatUtils from '@/services/chatUtils';
import ChannelMember, { DEFAULT_CHANNEL_MEMBER } from '@/types/ChannelMember';
import Tabs from '@/components/tab/Tabs.vue';
import Tab from '@/components/tab/Tab.vue';
import User from '@/types/User';
import ChannelRestriction, { DEFAULT_CHANNEL_RESTRICTION } from '@/types/ChannelRestriction';

export default defineComponent({
  name: 'ChatEdit',
  components: {
    FormInput, FormSelect, Tabs, Tab,
  },
  props: {
    requestChatId: String,
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const currentUser = computed(() => store.getUser);

    const channelTypes = [
      'Public',
      'Privé',
    ];

    const isLoad = ref(false);

    const editChannelData = ref<Channel>({ ...DEFAULT_CHANNEL, channelType: channelTypes[0], isPasswordEnabled: false });
    const editChannelDataErrors = ref<any>({});

    const getChannelData = (channelId: Channel['id']) => {
      api.channels.getChannelById(channelId)
        .then((response) => {
          if (!chatUtils.isUserIsAdmin(response.data, currentUser.value?.id)) {
            router.replace({ name: 'ChatList' });
          } else {
            isLoad.value = true;
            editChannelData.value = { ...editChannelData.value, ...response.data };
            editChannelData.value.channelType = channelTypes[editChannelData.value.isPrivate ? 1 : 0];
            editChannelData.value.isPasswordEnabled = editChannelData.value.password !== null;
          }
        })
        .catch(() => {
          router.replace({ name: 'ChatList' });
        });
    };
    if (props.requestChatId === undefined) {
      router.replace({ name: 'ChatList' });
    } else {
      getChannelData(+props.requestChatId);
    }

    watch(
      () => editChannelData.value.channelType,
      () => {
        editChannelData.value.isPrivate = channelTypes[0] !== editChannelData.value.channelType;
      },
      { immediate: true },
    );

    const editChannel = () => {
      if (!chatUtils.isUserIsOwner(editChannelData.value, currentUser.value?.id)) {
        return;
      }
      if (!editChannelData.value.isPasswordEnabled || editChannelData.value.isPrivate) {
        editChannelData.value.password = null;
      }
      api.channels.editChannelById(editChannelData.value.id, editChannelData.value)
        .then(() => {
          router.push({ name: 'ChatId', params: { id: props.requestChatId } });
        })
        .catch((error) => {
          if (error.response.status === 400) {
            editChannelDataErrors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };

    const memberTypes = [
      'Aucun (supprimer du salon)',
      'Membre',
      'Admin',
    ];

    const editChannelMemberData = ref<ChannelMember>({ ...DEFAULT_CHANNEL_MEMBER });
    const editChannelMemberRoleData = ref(memberTypes[1]);
    const editChannelMemberRoleDataErrors = ref<any>({});

    watch(
      () => editChannelMemberData.value,
      () => {
        editChannelMemberRoleData.value = memberTypes[editChannelMemberData.value.isAdmin ? 2 : 1];
      },
      { immediate: true },
    );

    const editChannelMember = () => {
      if (!chatUtils.isUserIsOwner(editChannelData.value, currentUser.value?.id)) {
        return;
      }
      if (chatUtils.isUserIsOwner(editChannelData.value, editChannelMemberData.value.userId)) {
        alert('Le propriétaire du salon ne peux pas être modifier!');
        return;
      }
      if (editChannelMemberRoleData.value === memberTypes[0]) {
        api.channels.deleteChannelMembersById(editChannelMemberData.value.id)
          .then(() => {
            router.push({ name: 'ChatId', params: { id: props.requestChatId } });
          })
          .catch((error) => {
            if (error.response.status === 400) {
              editChannelMemberRoleDataErrors.value = error.response.data.errors || {};
            } else {
              console.warn(error.response.data.message);
            }
          });
      } else {
        editChannelMemberData.value.isAdmin = editChannelMemberRoleData.value === memberTypes[2];
        api.channels.editChannelMembers(editChannelMemberData.value.id, editChannelMemberData.value.isAdmin)
          .then(() => {
            router.push({ name: 'ChatId', params: { id: props.requestChatId } });
          })
          .catch((error) => {
            if (error.response.status === 400) {
              editChannelMemberRoleDataErrors.value = error.response.data.errors || {};
            } else {
              console.warn(error.response.data.message);
            }
          });
      }
    };

    const newChannelMemberData = ref('');
    const newChannelMemberDataErrors = ref<any>({});

    const addChannelMember = () => {
      api.channels.addChannelMembers(editChannelData.value.id, newChannelMemberData.value)
        .then(() => {
          router.push({ name: 'ChatId', params: { id: props.requestChatId } });
        })
        .catch((error) => {
          if (error.response.status === 400) {
            newChannelMemberDataErrors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };

    const restrictTypes = [
      'Mute',
      'Ban',
    ];

    const restrictChannelMemberData = ref<ChannelMember>({ ...DEFAULT_CHANNEL_MEMBER });
    const restrictChannelMemberTypeData = ref(restrictTypes[0]);
    const restrictChannelMemberEndAtData = ref<Date | null>(null);
    const restrictChannelMemberDataErrors = ref<any>({});

    const restrictChannelMember = () => {
      if (!chatUtils.isUserIsAdmin(editChannelData.value, currentUser.value?.id)) {
        return;
      }
      if (chatUtils.isUserIsOwner(editChannelData.value, restrictChannelMemberData.value.userId)) {
        alert('Le propriétaire du salon ne peux pas être sanctionné!');
        return;
      }
      const type = restrictTypes.findIndex((find) => find === restrictChannelMemberTypeData.value);
      api.channels.addChannelRestrictions(editChannelData.value.id, restrictChannelMemberData.value.userId, type, restrictChannelMemberEndAtData.value)
        .then(() => {
          router.push({ name: 'ChatId', params: { id: props.requestChatId } });
        })
        .catch((error) => {
          if (error.response.status === 400) {
            editChannelMemberRoleDataErrors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };

    const deleteRestrictChannelMemberData = ref<ChannelRestriction>({ ...DEFAULT_CHANNEL_RESTRICTION });
    const deleteRestrictChannelMemberDataErrors = ref<any>({});

    const deleteRestrictChannelMember = () => {
      if (!chatUtils.isUserIsAdmin(editChannelData.value, currentUser.value?.id)) {
        return;
      }
      api.channels.deleteChannelRestrictionsById(deleteRestrictChannelMemberData.value.id)
        .then(() => {
          router.push({ name: 'ChatId', params: { id: props.requestChatId } });
        })
        .catch((error) => {
          if (error.response.status === 400) {
            deleteRestrictChannelMemberDataErrors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };

    const getMemberName = (userId: User['id']) => {
      const member = chatUtils.getMember(editChannelData.value, userId);
      if (member && member.user) {
        return member.user.username;
      }
      return userId;
    };

    return {
      // Utils
      chatUtils,
      currentUser,
      isLoad,
      getMemberName,
      // Edit Channel Data
      channelTypes,
      editChannelData,
      editChannel,
      editChannelDataErrors,
      // Edit Channel Member
      memberTypes,
      editChannelMemberData,
      editChannelMemberRoleData,
      editChannelMemberRoleDataErrors,
      editChannelMember,
      // New Channel Member
      newChannelMemberData,
      newChannelMemberDataErrors,
      addChannelMember,
      // Restrict Channel Member
      restrictTypes,
      restrictChannelMemberData,
      restrictChannelMemberTypeData,
      restrictChannelMemberEndAtData,
      restrictChannelMemberDataErrors,
      restrictChannelMember,
      // Delete Restrict channel Member
      deleteRestrictChannelMemberData,
      deleteRestrictChannelMemberDataErrors,
      deleteRestrictChannelMember,
    };
  },
});
</script>

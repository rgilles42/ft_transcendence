<template>
  <div class="mb-8">
    <div class="margin-navbar"></div>
    <section class="container mx-auto">

      <form @submit.prevent="checkForm">
        <div class="mb-4 p-4 bg-gray-700 bg-opacity-50 rounded flex-1">

          <div class="px-6 py-4 grid md:grid-flow-col gap-4">
            <FormInput title="Nom du salon" name="title" v-model="newChannelData.title" :errors="errors" :required="true" />
            <FormSelect title="Type" name="isPrivate" v-model="newChannelData.channelType" :options="channelTypes" :errors="errors" required />
            <FormInput title="Activer le mot de passe" type="checkbox" v-model="newChannelData.isPasswordEnabled" :errors="errors" :disabled="newChannelData.isPrivate" />
            <FormInput title="Mot de passe" type="password" name="password" v-model="newChannelData.password" :errors="errors" :disabled="!newChannelData.isPasswordEnabled || newChannelData.isPrivate" />
          </div>

          <span v-if="errors.global && errors.global.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1">
            <li v-for="(error, index) in errors.global" :key="index">{{ error }}</li>
          </span>

          <div class="px-6 py-4 grid md:grid-flow-col gap-4 text-center">
            <button class="bg-green-900 hover:bg-green-800 p-3 w-full focus:no-border">Créer un salon de discution</button>
          </div>

        </div>
      </form>

    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import api from '@/api';
import Channel, { DEFAULT_CHANNEL } from '@/types/Channel';
import { useRouter } from 'vue-router';
import FormSelect from '@/components/form/FormSelect.vue';
import FormInput from '../../components/form/FormInput.vue';

export default defineComponent({
  name: 'ChatCreation',
  components: { FormInput, FormSelect },
  setup() {
    const router = useRouter();

    const channelTypes = [
      'Public',
      'Privé',
    ];

    const newChannelData = ref<Channel>({ ...DEFAULT_CHANNEL, channelType: channelTypes[0], isPasswordEnabled: false });
    const errors = ref<any>({});

    watch(
      () => newChannelData.value.channelType,
      () => {
        newChannelData.value.isPrivate = channelTypes[0] !== newChannelData.value.channelType;
      },
      { immediate: true },
    );

    const checkForm = () => {
      if (!newChannelData.value.isPasswordEnabled || newChannelData.value.isPrivate) {
        newChannelData.value.password = null;
      }
      api.channels.createChannel(newChannelData.value)
        .then(() => {
          router.push({ name: 'ChatList' });
        })
        .catch((error) => {
          if (error.response.status === 400) {
            errors.value = error.response.data.errors || {};
          } else {
            console.warn(error.response.data.message);
          }
        });
    };
    return {
      channelTypes,
      newChannelData,
      checkForm,
      errors,
    };
  },
});
</script>

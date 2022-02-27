<template>
  <div class="mb-8">
    <div class="margin-navbar"></div>
    <section class="container mx-auto">

      <form @submit.prevent="checkForm">
        <div class="mb-4 p-4 bg-gray-700 bg-opacity-50 rounded flex-1">

          <div class="px-6 py-4 grid md:grid-flow-col gap-4">
            <FormInput title="Nom du salon" name="title" id="title" v-model="newChannelData.title" :errors="errors" :required="true" />
            <FormInput title="Activer le mot de passe" type="checkbox" v-model="newChannelData.isPasswordDisabled" :errors="errors" />
            <FormInput title="Mot de passe" name="password" id="password" v-model="newChannelData.password" :errors="errors" :disabled="newChannelData.isPasswordDisabled" />
            <FormInput :title="`Type: ${newChannelData.isPrivate ? 'Privée' : 'Public'}`" type="checkbox" name="isPrivate" id="isPrivate" v-model="newChannelData.isPrivate" :errors="errors" />
          </div>

          <span v-if="errors.global && errors.global.length > 0" class="flex items-center font-medium tracking-wide text-red-500 text-xs ml-1">
            <li v-for="(error, index) in errors.global" :key="index">{{ error }}</li>
          </span>

          <div class="px-6 py-4 grid md:grid-flow-col gap-4 text-center">
            <button class="bg-green-800 p-3 w-full focus:no-border">Créer un salon de discution</button>
          </div>

        </div>
      </form>

    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from '@/api';
import Channel, { DEFAULT_CHANNEL } from '@/types/Channel';
import { useRouter } from 'vue-router';
import FormInput from '../../components/form/FormInput.vue';

export default defineComponent({
  name: 'ChatCreation',
  components: { FormInput },
  setup() {
    const router = useRouter();

    const newChannelData = ref<Channel>({ ...DEFAULT_CHANNEL, isPasswordDisabled: true });
    const errors = ref<any>({});

    const checkForm = () => {
      if (newChannelData.value.isPasswordDisabled) {
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
      newChannelData,
      checkForm,
      errors,
    };
  },
});
</script>

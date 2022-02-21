<template>
<div class="w-full">
  <div class="flex bg-gray-900 border-t border-gray-800">
    <div class="container mx-auto px-6 py-3">
      <div class="my-8 flex flex-col md:flex-row">
        <div class="flex-1 mr-16">
          <h5 class="text-xl uppercase text-shadow text-white">ft_transcendence</h5>
          <p class="mt-4">
            Ce projet à été réalisé avec amour !
            Prennez plaisir a vous balader ! :)
          </p>
        </div>
        <div class="flex-1 mr-16">
          <h5 class="text-xl uppercase text-shadow text-white">Nos informations</h5>
          <p class="mt-4">
            <ul class="mt-4 text-sm list-inside list-disc">
              <li class="mb-1"><a href="https://profile.intra.42.fr/users/ppaglier">ppaglier</a></li>
              <li class="mb-1"><a href="https://profile.intra.42.fr/users/rgilles">rgilles</a></li>
              <li class="mb-1"><a href="https://profile.intra.42.fr/users/pkevin">pkevin</a></li>
            </ul>
          </p>
        </div>
        <div class="flex-1">
          <h5 class="text-xl uppercase text-shadow text-white">Liens utiles</h5>
          <ul class="mt-4 text-sm list-inside list-disc">
            <template v-if="!currentUser">
              <li class="mb-1"><router-link to="/auth/login">Connexion</router-link></li>
            </template>
            <template v-else>
              <li class="mb-1">
                <router-link to="/profile/me">Profil</router-link>
              </li>
              <li class="mb-1">
                <router-link to="/auth/logout">Déconnexion</router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <p class="text-sm text-center text-gray-400">
        © 2020-2022 Ouèbesèrve's team. Tous droits réservés.
      </p>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Footer',
  setup() {
    const store = useStore();
    return {
      currentUser: computed(() => store.getUser),
    };
  },
});
</script>

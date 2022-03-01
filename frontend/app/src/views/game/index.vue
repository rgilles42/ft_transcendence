<template>
  <div>

      <div class="mt-8">
        <section class="flex-grow mx-4">

          <div class="mb-4 p-4 bg-gray-700 bg-opacity-50 rounded flex-1">
            <div class="px-6 py-4">
              <h1 class="font-bold text-xl mb-2">Liste des parties de Pong en cours!</h1>
              <button :disabled="isFindingGame" @click="enterInMatchmaking" class="bg-green-900 hover:bg-green-800 transition duration-100 ease-in-out text-white focus:outline-none p-2 text-xs rounded-full tracking-wider">
                Chercher une partie
              </button>
              <div class="text-base">
                <template v-if="!gameList || isFindingGame">
                  <Loader />
                </template>
                <template v-else>
                  <div class="mt-4 mb-4 w-full rounded-lg overflow-auto" :class="[gameList.length <= 0 ? 'justify-center text-center flex' : 'bg-gray-700 shadow-lg']">

                    <div v-if="gameList.length <= 0">
                      <h3 class="tracking-wide font-semibold text-lg">Il n'y a aucune partie... :'(</h3>

                      <div class="py-1 mb-0.5">
                        <img src="/noGame.gif" alt="Is there anybody out there?" />
                      </div>
                    </div>
                    <table v-else class="table-auto w-full text-center">
                      <thead class="bg-gray-700">
                        <tr>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Joueurs
                          </th>
                          <th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider uppercase">
                            Scores
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
                        <tr
                          v-for="(game, index) in gameList" :key="index"
                          class="border-b bg-gray-900 border-gray-700 hover:bg-gray-800"
                          @click="spectateGame(game)"
                        >
                          <template v-if="game.entity">
                            <td class="py-4 px-6 text-sm whitespace-nowrap">
                              {{ game.entity.player1?.username }} - {{ game.entity.player2?.username }}
                            </td>
                            <td class="py-4 px-6 text-sm whitespace-nowrap">
                              {{ game.entity.player1Score }} - {{ game.entity.player2Score }}
                            </td>
                            <td class="py-4 px-6 text-sm whitespace-nowrap">
                              {{ game.entity.map ? game.entity.map : 'Pong Original' }}
                            </td>
                            <td class="py-4 px-6 text-sm whitespace-nowrap">
                              {{ game.entity.powerUps ? game.entity.powerUps.join(', ') : 'Aucun' }}
                            </td>
                            </template>
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

  </div>
</template>

<script lang="ts">
import { GameObject } from '@/types/Game';
import websocketApi from '@/websocketsApi';
import { Socket } from 'socket.io-client';
import {
  computed,
  defineComponent, onBeforeUnmount, onMounted, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import Loader from '@/components/Loader.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'GameList',
  setup() {
    const router = useRouter();
    const gameList = ref<GameObject[]>([]);

    const store = useStore();
    const currentUser = computed(() => store.getUser);

    const onConnectionSuccess = () => {
      websocketApi.game.emitGetGames();
    };
    const onActiveGames = (games: GameObject[]) => {
      gameList.value = games;
    };

    const isFindingGame = ref(false);
    const onGameStarted = (game: GameObject) => {
      if (game.entity) {
        websocketApi.game.disconnect();
        router.push({ name: 'GamePlay', params: { requestGameId: game.entity.id } });
      }
    };

    const enterInMatchmaking = () => {
      if (isFindingGame.value) {
        return;
      }
      isFindingGame.value = true;
      websocketApi.game.onGameStarted(onGameStarted);
      websocketApi.game.emitJoinMatchmaking('default', []);
    };

    const unsubscribeEvents = (errOrReason?: Socket.DisconnectReason | Error) => {
      websocketApi.game.offConnectionSuccess(onConnectionSuccess);
      websocketApi.game.offConnectionFailed(unsubscribeEvents);
      websocketApi.game.offDisconnected(unsubscribeEvents);
      websocketApi.game.offActiveGames(onActiveGames);
      if (isFindingGame.value) {
        websocketApi.game.offGameStarted(onGameStarted);
      }
      websocketApi.game.disconnect();
      if (errOrReason !== undefined) {
        router.replace({ name: 'Home' });
      }
    };
    const subscribeEvents = () => {
      websocketApi.game.onConnectionSuccess(onConnectionSuccess);
      websocketApi.game.onConnectionFailed(unsubscribeEvents);
      websocketApi.game.onDisconnected(unsubscribeEvents);
      websocketApi.game.onActiveGames(onActiveGames);
    };
    subscribeEvents();
    onMounted(() => {
      websocketApi.game.connect();
    });
    onBeforeUnmount(() => {
      unsubscribeEvents();
    });

    const spectateGame = (game: GameObject) => {
      if (game.entity) {
        if (game.entity.player1Id === currentUser.value?.id || game.entity.player2Id === currentUser.value?.id) {
          router.push({ name: 'GamePlay', params: { requestGameId: game.entity.id } });
        } else {
          router.push({ name: 'GameSpectator', params: { requestGameId: game.entity.id } });
        }
      }
    };

    return {
      gameList,
      isFindingGame,
      enterInMatchmaking,
      spectateGame,
    };
  },
  components: { Loader },
});
</script>

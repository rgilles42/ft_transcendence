<template>
  <div v-if="!gameData">
    <Loader />
  </div>
  <div v-else class="container mx-auto minInherit">
    <div class="w-full bg-gray-800">
      <div class="text-center">{{ gameData.entity?.player1Score }} - {{ gameData.entity?.player2Score }}</div>
      <div>
        <canvas ref="gameCanvas" class="m-auto" :width="screenInfo.w * 0.5" :height="screenInfo.h* 0.5"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onBeforeUnmount, onMounted, ref,
} from 'vue';
import websocketApi from '@/websocketsApi';
import { Socket } from 'socket.io-client';
import { GameObject } from '@/types/Game';
import { useRouter } from 'vue-router';
import Loader from '@/components/Loader.vue';
import { screenInfo } from '@/services/screenBreakPoint';

export default defineComponent({
  name: 'GameSpectator',
  components: { Loader },
  props: {
    requestGameId: String,
  },
  setup(props) {
    const router = useRouter();
    const gameCanvas = ref<HTMLCanvasElement | null>(null);

    const gameData = ref<GameObject | null>(null);

    const draw = (game: any) => {
      if (!gameCanvas.value) {
        return;
      }
      const context = gameCanvas.value.getContext('2d');
      if (!context) {
        return;
      }
      // Draw field
      context.fillStyle = 'black';
      context.fillRect(0, 0, gameCanvas.value.width, gameCanvas.value.height);

      // Draw middle line
      context.strokeStyle = 'white';
      context.beginPath();
      context.moveTo(gameCanvas.value.width / 2, 0);
      context.lineTo(gameCanvas.value.width / 2, gameCanvas.value.height);
      context.stroke();

      // Draw players
      const racketHeight = gameCanvas.value.height * game.racketLen;
      const racketWidth = gameCanvas.value.width * 0.01;
      context.fillStyle = 'white';
      // Left player
      const leftPlayerPos = gameCanvas.value.height * game.leftRacketPos - racketHeight / 2;
      context.fillRect(0, leftPlayerPos, racketWidth, racketHeight);
      // Right player
      const rightPlayerPos = gameCanvas.value.height * game.rightRacketPos - racketHeight / 2;
      context.fillRect(gameCanvas.value.width - racketWidth, rightPlayerPos, racketWidth, racketHeight);
      // Draw ball
      context.beginPath();
      context.fillStyle = 'white';
      const witdhRatio = (gameCanvas.value.width * game.ball.size);
      const heightRatio = (gameCanvas.value.height * game.ball.size);
      const ballRadius = (Math.min(witdhRatio, heightRatio) + ((Math.max(witdhRatio, heightRatio) - Math.min(witdhRatio, heightRatio)) / 2)) / 2;
      context.arc(gameCanvas.value.width * game.ball.xPos, gameCanvas.value.height * game.ball.yPos, ballRadius, 0, Math.PI * 2, false);
      context.fill();
    };

    const onConnectionSuccess = () => {
      if (props.requestGameId !== undefined) {
        websocketApi.game.emitObserveGame(+props.requestGameId);
      }
    };

    const onUpdateGame = (game: GameObject) => {
      gameData.value = game;
      draw(gameData.value);
    };

    const unsubscribeEvents = (errOrReason?: Socket.DisconnectReason | Error) => {
      websocketApi.game.offConnectionSuccess(onConnectionSuccess);
      websocketApi.game.offConnectionFailed(unsubscribeEvents);
      websocketApi.game.offDisconnected(unsubscribeEvents);
      websocketApi.game.offUpdateGame(onUpdateGame);
      websocketApi.game.disconnect();

      if (errOrReason !== undefined) {
        router.replace({ name: 'GameList' });
      }
    };

    const subscribeEvents = () => {
      websocketApi.game.onConnectionSuccess(onConnectionSuccess);
      websocketApi.game.onConnectionFailed(unsubscribeEvents);
      websocketApi.game.onDisconnected(unsubscribeEvents);
      websocketApi.game.onUpdateGame(onUpdateGame);
    };
    subscribeEvents();

    if (props.requestGameId === undefined) {
      router.replace({ name: 'GameList' });
    } else {
      onMounted(() => {
        websocketApi.game.connect();
      });
      onBeforeUnmount(() => {
        unsubscribeEvents();
      });
    }

    return {
      gameCanvas,
      gameData,
      screenInfo,
    };
  },
});
</script>

<style scoped>
  .minInherit {
    min-height: inherit;
  }
</style>

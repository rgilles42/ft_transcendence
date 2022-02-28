<template>
  <div>
    Chercher une game ?
    c'est ici
    sur le bouton chercher un match !
    <button @click="searchGame">Chercher un match</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GameIndex',
  setup() {
    const searchGame = () => {
      alert('Ceci est une descente de police!');
    };

    return {
      searchGame,
    };
  },
});
</script>

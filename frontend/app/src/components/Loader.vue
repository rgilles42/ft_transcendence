<template>
  <div class="text-center opacity-75 z-50">
    <span class="text-green-500 opacity-75" style="top: 50%;">
      <i class="fas fa-circle-notch fa-spin fa-2x m-5"></i>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Loader',
});
</script>

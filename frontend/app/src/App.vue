<template>
  <div id="app" class="flex flex-col min-h-screen">
    <Navbar />
    <div class="flex-grow" style="margin-top: 50px;">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
  components: {
    Navbar,
    Footer,
  },
});
</script>

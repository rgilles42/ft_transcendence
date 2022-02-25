<template>
  <main>
    <section>
      <ul class="block sm:flex">
        <slot name="tabs" v-bind:activeTab="activeTab" v-bind:clickTab="clickTab"></slot>
      </ul>
      <slot v-bind:activeTab="activeTab"></slot>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Tabs',
  props: {
    defaultActiveTab: String,
  },
  setup(props) {
    const activeTab = ref(props.defaultActiveTab);

    const clickTab = (name: string) => {
      activeTab.value = name;
    };

    return {
      activeTab,
      clickTab,
    };
  },
});
</script>

<style scoped>
</style>

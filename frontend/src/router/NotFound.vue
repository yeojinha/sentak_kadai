<template>
  <div>No Such Page Found.</div>
  <div>
    <router-link
      :to="{
        name: 'Home',
      }"
    >
      <h2 type="button">If you want to direct to HOME Click</h2>
    </router-link>
  </div>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    return {
      route,
    };
  },
};
</script>

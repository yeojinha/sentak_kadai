<template>
  <div class="app">
    <Header />
    <MainList />
  </div>
</template>

<script>
import MainList from "./components/MainList.vue";
import Header from "./components/Header.vue";
export default {
  components: {
    Header,
    MainList,
  },
};
</script>

<style></style>

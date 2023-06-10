<template>
  <div id="app">
    <TheHeader />
    <TheBody />
  </div>
</template>


<script>

import TheBody from "../src/views/TheBody.vue";
import TheHeader from "../src/views/TheHeader.vue";

export default {
  name: "App",
  components: {
    TheBody,
    TheHeader,
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f5f6fa;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #7386d5;
}
</style>

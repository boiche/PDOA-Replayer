<template>
  <div id="app">
    <Navbar></Navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
export default {
  components: {
    Navbar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 90vh
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

footer {
  bottom: -55px;
  position: static;
  width: 100%;
  height: 10vh;
}

.actions {
  display: block;
}

.icon {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  display: inline-block;
  background-color: black;
  cursor: pointer;
}

.chipAmount {
  fill: black;
  stroke-width: 1;
  stroke: DarkSlateGray;
  font-size: 20
}

.betAmount {
  fill: white;
  stroke: white;
  stroke-width: 1;
}

.chipsBackground {
  fill: black;
  rx: 35px;
  ry: 35px;
}

.playerChipsOnTableInfo {
  opacity: 0.6
}
</style>

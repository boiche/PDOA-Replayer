<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <LoggedInIndex v-if="getUser()"></LoggedInIndex>
    <LoggedOutIndex v-else></LoggedOutIndex>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import LoggedInIndex from '@/components/LoggedInIndex.vue'
import LoggedOutIndex from '@/components/LoggedOutIndex.vue'

export default {
  name: 'Home',
  components: {
    LoggedInIndex,
    LoggedOutIndex
  },
  methods: {
    getUser () {
      return this.$store.state.auth.user
    }
  }
}
</script>

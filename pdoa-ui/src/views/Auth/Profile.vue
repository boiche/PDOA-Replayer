<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        <img :src="flagURL">
        <strong>{{currentUser.username}}</strong> Profile
      </h3>
    </header>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      flagURL: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    if (!this.currentUser) {
      this.$router.push('/login')
    } else {
      this.flagURL = 'https://www.countryflags.io/' + this.$store.state.auth.user.countryCode + '/flat/32.png'
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <div id="nav">
    <b-navbar toggleable="lg" type="light" variant="light">
      <b-navbar-brand href="/">PDOA</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link to="/replay">PDOA Replayer</router-link>
          </b-nav-item>
          <b-nav-item disabled>
            <router-link to="/forum">Forum</router-link>
          </b-nav-item>
          <b-nav-item disabled>
            <router-link to="/analyser">Odds Analyser</router-link>
          </b-nav-item>
          <b-nav-item disabled>
            <router-link to="/offers">Offers</router-link>
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="/en">EN</b-dropdown-item>
            <b-dropdown-item href="/bg">BG</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="/register" v-if="!getUser()">Register</b-dropdown-item>
            <b-dropdown-item :href="userProfileLink" v-else>Profile</b-dropdown-item>
            <b-dropdown-item href="/login" v-if="!getUser()">Login</b-dropdown-item>
            <b-dropdown-item @click.prevent="logout" v-else>Logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userProfileLink: '/profile/'
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    },
    getUser () {
      return this.$store.state.auth.user
    }
  },
  created () {
    this.userProfileLink += this.$store.state.auth.user.username
  }
}
</script>

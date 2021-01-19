<template>
  <div>
    <header class="jumbotron container">
      <h3>
        <img :src="flagURL">
        <strong>{{currentUser.username}}</strong> Profile
      </h3>
    </header>
    <hr/>
    <h2 class="border border-dark" style="background: lightyellow; color: black; margin-top: 5px;margin-bottom: 10px; border-radius: 25px; display: inline-block; line-height: 12px; padding: 18px 26px 13px; text-transform: uppercase;">Your Hands</h2>
      <div class="row">
        <HandLink v-for="n in ownerHands.slice().reverse()" v-bind:key="n" :first="n.cards[0]" :second="n.cards[1]" :username="n.owner" :handId="n.handId"></HandLink>
      </div>
  </div>
</template>

<script>
import HandsService from '@/services/handsService'
import HandLink from '@/components/HandLink.vue'

export default {
  name: 'Profile',
  data () {
    return {
      ownerHands: [],
      allHands: '',
      cards: '',
      username: '',
      owner: '',
      handId: '',
      flagURL: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.auth.user
    }
  },
  async mounted () {
    this.allHands = await HandsService.getAll()
    this.username = this.$store.state.auth.user.username
    if (!this.currentUser) {
      this.$router.push('/login')
    } else {
      this.flagURL = 'https://www.countryflags.io/' + this.$store.state.auth.user.countryCode + '/flat/32.png'
    }
    for (var i = 0; i < this.allHands.length; i++) {
      if (this.allHands[i].owner === this.username) {
        this.ownerHands.push(this.allHands[i])
      }
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      this.$router.push('/')
    }
  },
  components: {
    HandLink
  }
}
</script>

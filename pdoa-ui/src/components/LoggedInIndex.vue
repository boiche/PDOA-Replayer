<template>
  <div>
    <h1>Welcome, {{username}}</h1>
    <h2 class="border border-dark" style="background: lightyellow; color: black; margin-top: 5px;margin-bottom: 10px; border-radius: 25px; display: inline-block; line-height: 12px; padding: 18px 26px 13px; text-transform: uppercase;">Last Hands</h2>
    <div id="recentHands">
      <div class="row">
        <HandLink v-for="n in allHands" v-bind:key="n" :first="n.cards[0]" :second="n.cards[1]" :username="n.owner" :handId="n.handId"></HandLink>
      </div>
    </div>
  </div>
</template>

<script>
import HandsService from '../services/handsService.js'
import HandLink from '@/components/HandLink.vue'

export default {
  data () {
    return {
      allHands: '',
      cards: '',
      username: '',
      owner: '',
      handId: ''
    }
  },
  async created () {
    this.allHands = await HandsService.getAll()
    this.allHands = this.allHands.reverse()
  },
  mounted () {
    this.username = this.$store.state.auth.user.username
  },
  components: {
    HandLink
  }
}
</script>

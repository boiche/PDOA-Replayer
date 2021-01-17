<template>
  <div>
    <h1>You are logged in</h1>
    <hr/>
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
      allHands: [],
      cards: '',
      username: '',
      owner: '',
      handId: ''
    }
  },
  async created () {
    this.allHands = await HandsService.getAll()
    console.log(this.allHands)
  },
  components: {
    HandLink
  }
}
</script>

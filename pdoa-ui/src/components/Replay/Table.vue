<template>
    <svg id="table" width="90%" height="90%">
      <image :href="require('../../assets/table.svg')" x="5%" y="45" width="90%"></image>
      <Seat :id="'seat5'" :x="100" :y="10" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat1'" :x="30" :y="170" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat7'" :x="100" :y="330" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat3'" :x="400" :y="3" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat4'" :x="700" :y="3" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat6'" :x="1000" :y="10" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat2'" :x="1150" :y="170" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat8'" :x="1000" :y="330" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'playersSeat'" :x="550" :y="400" :firstSuit="playersFirstSuit" :secondSuit="playersSecondSuit" :firstCard="playersFirstCard" :secondCard="playersSecondCard"></Seat>
    </svg>
</template>
<script>
import Seat from '../../components/Replay/Seat.vue'
import HandService from '../../services/handsService.js'

export default {
  data () {
    return {
      playersFirstSuit: '',
      playersFirstCard: '',
      playersSecondSuit: '',
      playersSecondCard: ''
    }
  },
  components: {
    Seat
  },
  methods: {
    getId () {
      var id = ''
      for (var i = location.pathname.lastIndexOf('/') + 1; i < location.pathname.length; i++) {
        id += location.pathname[i]
      }
      return id
    }
  },
  async mounted () {
    var a = await HandService.getHandHistory(this.getId())
    if (a.seats < 9) {
      for (var i = a.seats; i < 9; i++) {
        document.getElementById('seat' + i).setAttribute('visibility', 'hidden')
      }
    }
    var playersHand = a.handHistory.handHistory.match('\\[(([2-9]|[AKQJT])[scdh]) (([2-9]|[AKQJT])[scdh])\\]')[0]
    switch (playersHand[2].toUpperCase()) {
      case 'S': this.playersFirstSuit = 'spades'; break
      case 'C': this.playersFirstSuit = 'clubs'; break
      case 'H': this.playersFirstSuit = 'hearts'; break
      case 'D': this.playersFirstSuit = 'diamonds'; break
    }
    this.playersFirstCard = playersHand.substr(1, 2).toUpperCase()

    switch (playersHand[5].toUpperCase()) {
      case 'S': this.playersSecondSuit = 'spades'; break
      case 'C': this.playersSecondSuit = 'clubs'; break
      case 'H': this.playersSecondSuit = 'hearts'; break
      case 'D': this.playersSecondSuit = 'diamonds'; break
    }
    this.playersSecondCard = playersHand.substr(4, 2).toUpperCase()
  }
}
</script>

<template>
    <svg id="table" width="90%" height="90%">
      <image :href="require('../../assets/table.svg')" x="5%" y="65" width="90%"></image>
      <image :href="require('../../assets/button.svg')" id="button"></image>
      <Card :id="'flop1'" :suit="flop[0].suit" :card="flop[0].card"></Card>
      <Card :id="'flop2'" :suit="flop[1].suit" :card="flop[1].card"></Card>
      <Card :id="'flop3'" :suit="flop[2].suit" :card="flop[2].card"></Card>
      <Card :id="'turn'" :suit="turn.suit" :card="turn.card"></Card>
      <Card :id="'river'" :suit="river.suit" :card="river.card"></Card>
      <Pot></Pot>
      <Seat :id="'seat6'" :chips="chips[3]" :username="usernames[3]" :x="125" :y="45" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat2'" :chips="chips[2]" :username="usernames[2]" :x="30" :y="190" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat9'" :chips="chips[1]" :username="usernames[1]" :x="100" :y="350" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat4'" :chips="chips[4]" :username="usernames[4]" :x="400" :y="18" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat5'" :chips="chips[5]" :username="usernames[5]" :x="700" :y="18" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat7'" :chips="chips[6]" :username="usernames[6]" :x="975" :y="45" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat3'" :chips="chips[7]" :username="usernames[7]" :x="1150" :y="190" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat8'" :chips="chips[8]" :username="usernames[8]" :x="1000" :y="350" firstSuit="backs" secondSuit="backs" firstCard="2B" secondCard="2B"></Seat>
      <Seat :id="'seat1'" :chips="chips[0]" :username="usernames[0]" :x="550" :y="420" :firstSuit="playersFirstSuit" :secondSuit="playersSecondSuit" :firstCard="playersFirstCard" :secondCard="playersSecondCard"></Seat>
    </svg>
</template>
<script>
import Seat from '../../components/Replay/Seat.vue'
import Card from '../../components/Replay/Card.vue'
import Pot from '@/components/Replay/Pot.vue'

import HandService from '../../services/handsService.js'
import ReplayService from '../../services/replayService.js'

export default {
  data () {
    return {
      playerInitialSeat: '',
      playersFirstSuit: 'backs',
      playersFirstCard: '2B',
      playersSecondSuit: 'backs',
      playersSecondCard: '2B',
      usernames: [],
      chips: [],
      flop: [
        { suit: 'backs', card: '2B' }, { suit: 'backs', card: '2B' }, { suit: 'backs', card: '2B' }
      ],
      turn: { suit: 'backs', card: '2B' },
      river: { suit: 'backs', card: '2B' }
    }
  },
  components: {
    Seat,
    Card,
    Pot
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

    ReplayService.populateSteps(a, this)
    this.usernames = ReplayService.usernames
    this.chips = ReplayService.chips
  }
}
</script>

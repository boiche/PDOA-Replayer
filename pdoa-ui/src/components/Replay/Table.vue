<template>
    <svg id="table" width="90%" height="90%">
      <image :href="require('../../assets/table.svg')" x="5%" y="65" width="90%"></image>
      <text id="potInfo" fill="black" stroke-width="1" stroke="DarkSlateGray" font-size="20" x="46%" y="200">Pot: {{pot}}</text>
      <image :href="require('../../assets/button.svg')" id="button"></image>
      <Card :id="'flop1'" :suit="flop[0].suit" :card="flop[0].card"></Card>
      <Card :id="'flop2'" :suit="flop[1].suit" :card="flop[1].card"></Card>
      <Card :id="'flop3'" :suit="flop[2].suit" :card="flop[2].card"></Card>
      <Card :id="'turn'" :suit="turn.suit" :card="turn.card"></Card>
      <Card :id="'river'" :suit="river.suit" :card="river.card"></Card>
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
      river: { suit: 'backs', card: '2B' },
      pot: 0
    }
  },
  components: {
    Seat,
    Card
  },
  methods: {
    getId () {
      var id = ''
      for (var i = location.pathname.lastIndexOf('/') + 1; i < location.pathname.length; i++) {
        id += location.pathname[i]
      }
      return id
    },
    setButtonCoords (handHistory) {
      var button = document.getElementById('button')
      var seatId = handHistory.match('#\\d is the button')[0][1]
      var dealerUsername = handHistory.match(seatId + ': [^ ]+ \\((\\$|\\d)')[0]
      dealerUsername = dealerUsername.substring(3, dealerUsername.length - 3)
      var dealerSeat = this.usernames.indexOf(dealerUsername) + 1
      var seat = document.getElementById('seat' + dealerSeat)
      switch (dealerSeat) {
        case 1:
          button.setAttribute('x', seat.getBoundingClientRect().x)
          button.setAttribute('y', seat.getBoundingClientRect().y * 0.67)
          break
        case 2:
          button.setAttribute('x', seat.getBoundingClientRect().x * 2.25)
          button.setAttribute('y', seat.getBoundingClientRect().y * 0.8)
          break
        case 3:
          button.setAttribute('x', seat.getBoundingClientRect().x * 0.87)
          button.setAttribute('y', seat.getBoundingClientRect().y * 0.8)
          break
        case 4:
          button.setAttribute('x', seat.getBoundingClientRect().x)
          button.setAttribute('y', seat.getBoundingClientRect().y - button.getBoundingClientRect().height / 3)
          break
        case 5:
          button.setAttribute('x', seat.getBoundingClientRect().x)
          button.setAttribute('y', seat.getBoundingClientRect().y - button.getBoundingClientRect().height / 3)
          break
        case 6:
          button.setAttribute('x', seat.getBoundingClientRect().x * 1.5)
          button.setAttribute('y', seat.getBoundingClientRect().y)
          break
        case 7:
          button.setAttribute('x', seat.getBoundingClientRect().x * 0.9)
          button.setAttribute('y', seat.getBoundingClientRect().y)
          break
        case 8:
          button.setAttribute('x', seat.getBoundingClientRect().x * 0.85)
          button.setAttribute('y', seat.getBoundingClientRect().y - seat.getBoundingClientRect().height * 1.5)
          break
        case 9:
          button.setAttribute('x', seat.getBoundingClientRect().x * 1.75)
          button.setAttribute('y', seat.getBoundingClientRect().y - seat.getBoundingClientRect().height * 1.1)
          break
      }
    }
  },
  async mounted () {
    var a = await HandService.getHandHistory(this.getId())
    if (a.seats < 9) {
      for (var i = a.seats + 1; i <= 9; i++) {
        document.getElementById('seat' + i).setAttribute('visibility', 'hidden')
      }
    }

    if (a.handHistory.handHistory.match(a.username)[0] !== '') {
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
    } else {
      this.usernames.push('Player 1')
      this.playersFirstSuit = 'backs'
      this.playersFirstCard = '2B'
      this.playersSecondSuit = 'backs'
      this.playersSecondCard = '2B'
    }

    var playersData = ReplayService.gatherPlayersData(a.handHistory.handHistory, a.username, a.seats)
    this.usernames = playersData[0][0]
    this.chips = playersData[1][0]

    this.playerInitialSeat = a.handHistory.handHistory.match('Seat \\d: ' + a.username)[0].substr(5, 1)
    this.setButtonCoords(a.handHistory.handHistory)
    ReplayService.populateSteps(a.handHistory.handHistory, this.usernames, this.chips)
  }
}
</script>

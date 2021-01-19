<template>
  <div class="border border-dark "
       style="background: lightyellow; margin-bottom: 10px; border-radius: 25px; margin-left: 100px; width:25%">
    <a :href="link" id="link">
    <img :src="firstCard" id="firstCard" height="200px" style="margin-top: 5px; margin-right: 3px">
    <img :src="secondCard" id="secondCard" height="200px" style="margin-top: 5px">
    <h5
      style="background: deepskyblue; color: black; margin-top: 5px; border-radius: 25px; display: inline-block; font-size: 12px; font-weight: bold; line-height: 12px; padding: 10px 15px 8px; text-transform: uppercase;">Posted by {{username}}</h5>
    </a>
  </div>
</template>
<script>
export default {
  data () {
    return {
      firstCard: '',
      secondCard: '',
      link: ''
    }
  },
  props: {
    first: String,
    second: String,
    username: String,
    handId: Number
  },
  mounted () {
    var suit
    var suit2
    switch (this.first[1]) {
      case 'c': suit = 'clubs'; break
      case 'd': suit = 'diamonds'; break
      case 'h': suit = 'hearts'; break
      case 's': suit = 'spades'; break
      case 'B': suit = 'backs'; break
    }
    this.firstCard = require('@/assets/cards/' + suit + '/' + this.first.toUpperCase() + '.svg')
    switch (this.second[1]) {
      case 'c': suit2 = 'clubs'; break
      case 'd': suit2 = 'diamonds'; break
      case 'h': suit2 = 'hearts'; break
      case 's': suit2 = 'spades'; break
      case 'B': suit2 = 'backs'; break
    }
    this.secondCard = require('@/assets/cards/' + suit2 + '/' + this.second.toUpperCase() + '.svg')

    this.link = 'http://localhost:8081/replay/' + this.handId
  }
}
</script>

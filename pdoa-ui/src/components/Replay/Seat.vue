<template>
  <svg :x="x" :y="y" :id="id" class="playerSeat" width="14.6%" height="20%" style="outline: 3px solid black">
    <image x="0" :href="require('../../assets/cards/' + firstSuit + '/' + firstCard + '.svg')" width="50%" height="100%"></image>
    <image x="50%" :href="require('../../assets/cards/' + secondSuit + '/' + secondCard + '.svg')" width="50%" height="100%"></image>
    <rect y="52%" x="2" width="98.1%" height="46%" style="fill:gray;stroke:black;stroke-width:5"></rect>
    <g>
      <text y="70%" x="40%" fill="white">{{username}}</text>
      <text y="87%" x="45%" fill="white">{{chips}}</text>
    </g>
  </svg>
</template>
<script>
export default {
  data () {
    return {
      username: 'Player 1',
      chips: '500'

    }
  },
  props: {
    x: Number,
    y: Number,
    firstCard: String,
    secondCard: String,
    firstSuit: String,
    secondSuit: String,
    id: String
  }
}
</script>

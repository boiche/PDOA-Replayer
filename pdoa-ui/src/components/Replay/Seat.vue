<template>
  <svg :x="x" :y="y" class="playerSeat" width="14.6%" height="20%" style="outline: 3px solid black">
    <image x="0" :href="require('../../assets/cards/clubs/2C.svg')" width="50%" height="100%"></image>
    <image x="50%" :href="require('../../assets/cards/clubs/AC.svg')" width="50%" height="100%"></image>
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
      chips: '500',
      xs: this.x,
      ys: 553

    }
  },
  props: {
    x: Number,
    y: Number
  }
}
</script>

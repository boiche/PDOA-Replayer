<template>
  <svg :x="x" :y="y" :id="id" class="playerSeat" width="14.6%" height="20%" style="outline: 3px solid black">
    <image class="card holeCard" x="0" :href="require('../../assets/cards/' + firstSuit + '/' + firstCard + '.svg')" width="50%" height="100%"></image>
    <image class="card holeCard" x="50%" :href="require('../../assets/cards/' + secondSuit + '/' + secondCard + '.svg')" width="50%" height="100%"></image>
    <rect y="52%" x="2" width="98.1%" height="46%" style="fill:gray;stroke:black;stroke-width:5"></rect>
    <text class="playerUsername" y="70%" x="35%" fill="white">{{username}}</text>
    <text class="playerChips" y="87%" x="40%" fill="white">{{chips}}</text>
  </svg>
</template>
<script>
export default {
  props: {
    x: Number,
    y: Number,
    firstCard: String,
    secondCard: String,
    firstSuit: String,
    secondSuit: String,
    id: String,
    username: String,
    chips: String
  },
  updated () {
    var seat = document.getElementById(this.id)
    var container = seat.getElementsByTagName('rect')[0]
    var containerWidth = container.getBoundingClientRect().width
    var usernames = seat.getElementsByTagName('text')
    var usernameWidth = usernames[0].textLength.baseVal.value
    var difference = containerWidth - usernameWidth
    usernames[0].setAttribute('x', difference / 2)
  }
}
</script>

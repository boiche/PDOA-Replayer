<template>
    <svg visibility="hidden">
      <image :id="id" class="card communityCard" :href="require('../../assets/cards/' + suit + '/' + card + '.svg')"></image>
    </svg>
</template>
<script>
export default {
  props: {
    suit: String,
    card: String,
    id: String
  },
  mounted () {
    var card = document.getElementsByClassName('holeCard')[0]
    var height = card.getBoundingClientRect().height
    var width = card.getBoundingClientRect().width
    var commCards = document.getElementsByClassName('communityCard')
    var x = 400
    var y = 220
    for (var i = 0; i < commCards.length; i++) {
      commCards[i].setAttribute('height', height)
      commCards[i].setAttribute('width', width)
      commCards[i].setAttribute('x', x)
      commCards[i].setAttribute('y', y)
      x += width + 3
    }
  }
}
</script>

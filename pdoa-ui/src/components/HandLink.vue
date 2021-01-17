<template>
  <div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      firstCard: '',
      secondCard: ''
    }
  },
  props: {
    first: String,
    second: String
  },
  mounted () {
    var suit
    if (this.first[1] === 'C') suit = 'clubs'
    this.firstCard = require('@/assets/cards/' + suit + '/' + this.first + '.svg')
  }
}
</script>

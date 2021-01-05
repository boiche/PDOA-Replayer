<template>
  <div>
    <img :src="firstCard" id="firstCard" loading="lazy">
    <img :src="secondCard" id="secondCard">
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
    this.firstCard = './assets/cards/' + suit + '/' + this.first + '.svg'
  }
}
</script>

<template>
    <svg id="table" width="90%" height="90%">
      <image :href="require('../../assets/table.svg')" x="5%" y="45" width="90%"></image>
      <Seat :x="100" :y="10"></Seat>
      <Seat :x="30" :y="170"></Seat>
      <Seat :x="100" :y="330"></Seat>
      <Seat :x="400" :y="3"></Seat>
      <Seat :x="700" :y="3"></Seat>
      <Seat :x="1000" :y="10"></Seat>
      <Seat :x="1150" :y="170"></Seat>
      <Seat :x="1000" :y="330"></Seat>
      <Seat :x="550" :y="400"></Seat>
    </svg>
</template>
<script>
import Seat from '../../components/Replay/Seat.vue'
export default {
  data () {
    return {
      image: '../../assets/table.svg'
    }
  },
  components: {
    Seat
  }
}
</script>

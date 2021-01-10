<template>
  <div class="actions">
    <div class="btn btn-optional" v-on:click="prev">Prev</div>
    <div class="btn btn-primary" v-if="play" v-on:click="play=false">Pause</div>
    <div class="btn btn-secondary" v-else v-on:click="play=true">Play</div>
    <div class="btn btn-optional" v-on:click="next">Next</div>
  </div>
</template>
<script>
import ReplayService from '@/services/replayService.js'
export default {
  data () {
    return {
      play: true,
      actionIndex: -1
    }
  },
  methods: {
    next () {
      var result = ReplayService.play(this.actionIndex + 1)
      if (result) this.actionIndex++
    },
    prev () {
      var result = ReplayService.play(this.actionIndex - 1)
      if (result) this.actionIndex--
    }
  }
}
</script>

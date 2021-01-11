<template>
  <div class="actions">
    <div class="btn btn-optional" v-on:click="prev">Prev</div>
    <div class="btn btn-primary" v-if="playing" v-on:click="pause()">Pause</div>
    <div class="btn btn-secondary" v-else v-on:click="play()">Play</div>
    <button id="nextButton" class="btn btn-optional" v-on:click="next">Next</button>
  </div>
</template>
<script>
import ReplayService from '@/services/replayService.js'
export default {
  data () {
    return {
      playing: false
    }
  },
  methods: {
    next () {
      ReplayService.playCurrent()
    },
    prev () {
      ReplayService.playCurrent()
    },
    play () {
      ReplayService.playAll()
      this.playing = true
    },
    pause () {
      ReplayService.pause()
      this.playing = false
    }
  }
}
</script>

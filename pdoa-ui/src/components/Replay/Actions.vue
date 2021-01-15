<template>
  <div class="actions">
    <div class="btn btn-optional" v-on:click="prev">Prev</div>
    <div class="btn btn-primary" v-if="playing&&!finished" v-on:click="pause()">Pause</div>
    <div class="btn btn-secondary" v-if="!playing&&!finished" v-on:click="play()">Play</div>
    <div class="btn btn-primary" v-if="finished" v-on:click="replay()">Replay</div>
    <button id="nextButton" class="btn btn-optional" v-on:click="next">Next</button>
  </div>
</template>
<script>
import ReplayService from '@/services/replayService.js'
export default {
  data () {
    return {
      playing: false,
      finished: false
    }
  },
  methods: {
    next () {
      ReplayService.playCurrent(this)
    },
    prev () {
      ReplayService.playCurrent(this)
    },
    play () {
      this.playing = true
      ReplayService.playAll(this)
    },
    pause () {
      ReplayService.pause()
      this.playing = false
    },
    replay () {
      this.finished = false
      ReplayService.reset()
      this.play()
    }
  }
}
</script>

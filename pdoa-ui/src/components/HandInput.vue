<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div id="">
    <h1>Hand input</h1>
    <div id="input" class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <textarea v-on:input="validate()" id="handInput" placeholder="Place your hand history here"></textarea>
      </div>
    </div>
    <div class="btn btn-success m-2" v-on:click="upload()">Upload</div>
    <div>
      {{message}}
    </div>
  </div>
</template>
<script>
import HandService from '../services/handsService.js'

export default {
  data () {
    return {
      isValid: false,
      message: '',
      content: '',
      id: '',
      handPattern: new RegExp('PokerStars Hand #\\d+:.+\\*\\*\\* SUMMARY \\*\\*\\*.+', 's')
    }
  },
  methods: {
    upload () {
      if (this.isValid) {
        this.content = document.getElementById('handInput').value
        HandService.uploadHand(this.content, this.$store.state.auth.user.username)
      } else {
        this.message = 'abe ne stana be chovek'
      }
    },
    validate () {
      console.log(document.getElementById('handInput').value.match(this.handPattern))
      if (document.getElementById('handInput').value.match(this.handPattern)) {
        this.message = 'stana'
        this.isValid = true
      } else {
        this.isValid = false
        this.message = 'ne stana'
      }
    }
  }
}
</script>
<style>
  #handInput {
    width: 100%
  }
</style>

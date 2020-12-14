<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div id="">
    <h1>Hand input</h1>
    <div id="input" class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <textarea id="handInput" placeholder="Place your hand history here"></textarea>
      </div>
    </div>
    <form>
      <label class="switch">
        Anonymise
        <input type="checkbox">
        <span class="slider round"></span>
      </label>
      <button type="submit" class="btn btn-success" v-on:click="upload">Upload</button>
    </form>
  </div>
</template>
<script>
import HandService from '../services/handsService.js'

export default {
  data () {
    return {
      content: ''
    }
  },
  methods: {
    upload () {
      this.content = document.getElementById('handInput').value
      console.log('entered the method')
      HandService.uploadHand(this.content)
    }
  }
}
</script>
<style>
  #handInput {
    width: 100%
  }
</style>

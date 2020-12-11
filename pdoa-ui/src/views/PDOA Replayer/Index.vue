<template>
  <div>
    <h1>PDOA Replayer</h1>
    <HandInput></HandInput>
  </div>
</template>
<script>
import HandInput from '../../components/HandInput.vue'
import HandsService from '../../services/handsService.js'
export default {
  components: {
    HandInput
  },
  onsubmit () {
    HandsService.uploadHand(HandInput.handInput)
  }
}
</script>

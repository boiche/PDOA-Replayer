<template>
  <div>
    <h1>You are logged in</h1>
    <div id="recentHands">
      <div class="row">
        <div class="col-4">
          <HandLink first="TC" second='KC'></HandLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HandsService from '../services/handsService.js'
import HandLink from '@/components/HandLink.vue'

export default {
  name: 'AllRecentHands',
  mounted: async function () {
    var a
    a = await HandsService.getAll()
    console.log(a)
  },
  components: {
    HandLink
  }
}
</script>

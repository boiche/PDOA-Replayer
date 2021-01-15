<template>
  <div id="handReplay" style="height: 100%">
    <div style="margin-bottom:25px">
      <h1>Hand by {{username}}</h1>
      <p>{{gameName}}</p>
    </div>
    <Actions></Actions>
    <Table></Table>
  </div>
</template>
<script>
import Table from '../../components/Replay/Table.vue'
import Actions from '@/components/Replay/Actions.vue'
import HandService from '../../services/handsService.js'

export default {
  data () {
    return {
      handHistory: '',
      username: '',
      gameName: ''
    }
  },
  components: {
    Table,
    Actions
  },
  methods: {
    getId () {
      var id = ''
      for (var i = location.pathname.lastIndexOf('/') + 1; i < location.pathname.length; i++) {
        id += location.pathname[i]
      }
      return parseInt(id)
    }
  },
  async created () {
    this.handHistory = await HandService.getHandHistory(this.getId())
    this.username = this.handHistory.username
    this.gameName = this.handHistory.handHistory.handHistory.match('(Tournament.+\\))|(Hold\'em.+\\))')[0].toString()
  }
}
</script>

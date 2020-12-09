<template>
  <div id=''>
    <header>
      <h3>{{content}}</h3>
    </header>
  </div>
</template>

<script>
import UsersService from '../services/user-service.js'
export default {
  name: 'User',
  data () {
    return {
      content: ''
    }
  },
  mounted () {
    UsersService.getAllUsers().then(
      response => {
        console.log(response)
        this.content = response.data
      },
      error => {
        this.content = (error.response && error.response.data) || error.message || error.toString()
      }
    )
  }
}
</script>

<style></style>

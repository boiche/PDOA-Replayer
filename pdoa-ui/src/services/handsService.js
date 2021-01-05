import axios from 'axios'
import router from '../router/index.js'
const API_URL = 'http://localhost:8080/hands'

class HandsService {
  async uploadHand (hand, username) {
    let handId
    await axios.post(API_URL + '/upload', { hand, username }).then(function (response) {
      console.log('The response id is ' + response.data.id)
      handId = response.data.id
    })
    console.log('Hand id: ' + handId)
    router.push({ name: 'handReplay', params: { id: handId } })
    // router.push({ path: `/replay/${handId}` })
  }

  async getAll () {
    var a
    await axios.get(API_URL + '/all').then(function (response) {
      a = response.data
    })
    return a
  }
}
export default new HandsService()

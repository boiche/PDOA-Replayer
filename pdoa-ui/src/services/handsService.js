import axios from 'axios'
import router from '../router/index.js'
const API_URL = 'http://localhost:8080/hands'

class HandsService {
  async uploadHand (hand, username) {
    let handId
    await axios.post(API_URL + '/upload', { hand, username }).then(function (response) {
      handId = response.data.id
    })
    router.push({ name: 'handReplay', params: { id: handId } })
  }

  async getAll () {
    var a
    await axios.get(API_URL + '/all').then(function (response) {
      a = response.data
    })
    return a
  }

  async getHandHistory (id) {
    var handData
    await axios.post(API_URL + '/getHand', { id }).then(function (response) {
      handData = response.data
    }, function (error) {
      console.log(error)
      console.clear()
      router.push('/')
    })
    return handData
  }
}
export default new HandsService()

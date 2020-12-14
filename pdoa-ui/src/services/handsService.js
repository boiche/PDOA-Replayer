import axios from 'axios'
const API_URL = 'http://localhost:8080/hands'

class HandsService {
  uploadHand (hand) {
    axios.post(API_URL + '/upload', hand).then(function (response) {
      console.log('The data is ' + response.data.hand)
      axios.get('http://localhost:8081')
    })
  }
}
export default new HandsService()

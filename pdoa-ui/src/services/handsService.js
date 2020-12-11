import axios from 'axios'
const API_URL = 'http://localhost:8080/hands'

class HandsService {
  uploadHand (hand) {
    axios.post(API_URL + '/upload', JSON.parse(hand)).then(function (response) { console.log(response) })// upload hand and return its id
  }
}
export default new HandsService()

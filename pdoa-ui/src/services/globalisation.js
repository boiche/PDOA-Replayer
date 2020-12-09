import axios from 'axios'
const API_URL = 'http://localhost:8080/globalisation'

class GlobalisationService {
  change (var changeTo) {
    return axios.get(API_URL + '/' + changeTo)
  }
}

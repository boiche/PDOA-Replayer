import axios from 'axios'
const API_URL = 'http://localhost:8080/hands'

public class HandsService {
  uploadHand() {
    var result = axios.post(API_URL + '/upload');
    return axios.get(API_URL + '/play/' + result.id);
  }
}

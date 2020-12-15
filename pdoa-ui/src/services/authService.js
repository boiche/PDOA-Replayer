import axios from 'axios'
import router from '../router/index.js'
const API_URL = 'http://localhost:8080/auth'

class AuthService {
  registerUser (data) {
    return axios.post(API_URL + '/register', data).then(function (response) {
      console.log('Front-end message: user registered successfully!')
      router.push('/')
    })
  }
}

export default new AuthService()

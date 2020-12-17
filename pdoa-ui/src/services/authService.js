import axios from 'axios'
import router from '../router/index.js'
const API_URL = 'http://localhost:8080/auth'

class AuthService {
  registerUser (data) {
    return axios.post(API_URL + '/register', data).then(function (response) {
      console.log('Front-end message: user ' + data.username + 'registered successfully!')
      router.push('/')
    })
  }

  loginUser (data) {
    return axios.post(API_URL + '/login', data).then(function (response) {
      console.log('the token is: ' + response.data.token)
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }

      return response.data
      // router.push('/')
    })
  }

  logout () {
    localStorage.removeItem('user')
  }
}

export default new AuthService()

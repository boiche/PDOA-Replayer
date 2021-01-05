import axios from 'axios'
import router from '../router/index.js'
const API_URL = 'http://localhost:8080/auth'

class AuthService {
  registerUser (data) {
    return axios.post(API_URL + '/register', data).then(function (response) {
      console.log('Front-end message: user ' + data.username + 'registered successfully!')

      router.push('/login')
    })
  }

  loginUser (data) {
    const dataForm = {
      username: data.username,
      password: data.password
    }
    return axios.post(API_URL + '/login', dataForm).then(function (response) {
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

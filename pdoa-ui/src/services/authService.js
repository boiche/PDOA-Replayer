import axios from 'axios'
import router from '../router/index.js'
import crypto from 'crypto-js'
const API_URL = 'http://localhost:8080/auth'

class AuthService {
  registerUser (data) {
    return axios.post(API_URL + '/register', data).then(function (response) {
      console.log('Front-end message: user ' + data.username + 'registered successfully!')

      router.push('/login')
    })
  }

  loginUser (data) {
    var key = '32bytespleaseyte'
    var bytesKey = []
    for (var i = 0; i < key.length; i++) {
      var char = key.charCodeAt(i)
      bytesKey.push(char >>> 8)
      bytesKey.push(char & 0xFF)
    }
    const iv = crypto.enc.Hex.parse('encryptionIntVec')

    const encrypted = crypto.AES.encrypt(data.password, bytesKey, { iv: iv })
    const dataForm = {
      username: data.username,
      password: encrypted.toString(),
      key: bytesKey,
      initVector: iv
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

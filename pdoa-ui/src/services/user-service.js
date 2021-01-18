import axios from 'axios'
const API_URL = 'http://localhost:8080/users'

class UsersService {
  getAllUsers () {
    return axios.get(API_URL + '/all')
  }

  async getUserById (userId) {
    return axios.get(API_URL + '/user', { params: { param: parseInt(userId), byUsername: false } })
  }

  async getUserByUsername (username) {
    return axios.get(API_URL + '/user', { params: { param: username, byUsername: true } })
  }
}

export default new UsersService()

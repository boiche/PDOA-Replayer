import axios from 'axios'
const API_URL = 'http://localhost:8080/users'

class UsersService {
  getAllUsers () {
    return axios.get(API_URL + '/all')
  }

  async getUser (userId) {
    return axios.get(API_URL + '/user', { params: { id: parseInt(userId) } })
  }
}

export default new UsersService()

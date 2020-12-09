import axios from 'axios'
const API_URL = 'http://localhost:8080/users'

class UsersService {
  getAllUsers () {
    return axios.get(API_URL + '/all')
  }
}
export default new UsersService()

import axios from 'axios'

const oldToken = localStorage.getItem('token')
const requestGetUserinfo = axios.create({
  baseURL: 'http://127.0.0.1:3030',
  headers: { Authorization: oldToken }
})
export default requestGetUserinfo

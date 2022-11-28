import axios from 'axios'
import { Toast } from 'vant'

const Axios = axios.create({
  // baseURL: 'https://ifangtu.com:3030', /* 服务器 */
  baseURL: 'http://127.0.0.1:3030', /* 开发 */
  timeout: 5000
})

// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
  config.headers.Authorization = localStorage.getItem('token')
  if (config.url === '/team/setPic' || config.url === 'my/setPic') {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
Axios.interceptors.response.use(res => {
  if (res.data.status === 401) {
    Toast('登陆信息过期，请先登陆喔')
    // return false
  }
  return Promise.resolve(res)
}, function (error) {
  return Promise.reject(error)
})

export default Axios

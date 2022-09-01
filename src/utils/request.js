import axios from 'axios'
import { Toast } from 'vant'
// import router from '@/router/index.js'
// const oldToken = localStorage.getItem('token')
// const requestGetUserinfo = axios.create({
//   baseURL: 'http://127.0.0.1:3030',
//   headers: { Authorization: oldToken }
// })
// export default requestGetUserinfo

// if(process.env.NODE_ENV === 'development') {

//   baseURL = 'http://{本地地址}/xxx';

// } else if(process.env.NODE_ENV === 'production') {

//   baseURL = 'https://{线上地址}/xxx';

// }

// const token = localStorage.getItem('token')
const Axios = axios.create({
  baseURL: 'http://127.0.0.1:3030',
  timeout: 5000
  // headers: { Authorization: token }
})

// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
  // console.log(config)
  // if (!config.FormData) {
  //   config.headers = {
  //     Authorization: token,
  //     enctype: 'multipart/form-data'
  //   }
  //   console.log(config)
  //   return config
  // }
  // if (token) {
  // console.log(config)
  // console.log('token不存在')
  // const token = localStorage.getItem('token')
  config.headers.Authorization = localStorage.getItem('token')
  // }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 添加响应拦截器
Axios.interceptors.response.use(res => {
  // console.log(res)
  // if (res.data.status === 100) {
  //   localStorage.setItem('token', res.data.userData.token)
  // }

  if (res.data.status === 401) {
    Toast('登陆信息过期，请先登陆喔')
    // console.log(this)
  }
  return Promise.resolve(res)
}, function (error) {
  return Promise.reject(error)
})

export default Axios

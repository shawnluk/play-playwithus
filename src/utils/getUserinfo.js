import request from '@/utils/request.js'

// const res = request.get('/my/userinfo')
// const oldToken = localStorage.getItem('token')
// const res = request({
//   url: 'http://127.0.0.1:3030/my/userinfo',
//   method: 'get',
//   headers: { Authorization: oldToken }
// })

// export default res

const getUserinfo = function () {
  // console.log('请求时候的token:' + localStorage.getItem('token'))
  return request.get('/my/userinfo').then(res => res.data)
}

export default getUserinfo

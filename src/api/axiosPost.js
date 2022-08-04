import axios from 'axios'

// const token = localStorage.getItem('token')

// const instance = axios.create({
//   url: 'http://127.0.0.1:3030/my/userinfo',
//   headers: { Authorization: token }
// })

// export default instance

const _this = this
const oldToken = localStorage.getItem('token')
const url = 'http://127.0.0.1:3030/my/userinfo'
async function getToken () {
  const { data: res } = await axios({
    method: 'post',
    url: url,
    headers: { Authorization: oldToken }
  }).catch(err => {
    // console.log(err.response)
    if (err) {
      _this.$router.push('./user/login')
    }
  })
  // console.log(res)
  // console.log(_this)
  if (res.status) {
    if (res.status === 0) {
      _this.$router.push('/my/userinfo')
    }
  }
}

export default getToken

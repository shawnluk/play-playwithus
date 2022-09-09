/*
  用户模块 全局定义
*/
import { getUserInfo } from '@/api/user'

const UserModule = {
  namespaced: true,
  state () {
    return {
      userID: '',
      username: '',
      nickname: '',
      email: '',
      userPic: '',
      createTime: ''
    }
  },
  mutations: {
    setUserInfo (state, value) {
      state.userID = value.id
      state.username = value.username
      // state.nickname = value.nickname
      // state.email = value.email
      state.userPic = 'https://' + value.userPic
      // sessionStorage.setItem('isLogin', 1)
    }
  },
  actions: {
    async getUserInfo (store) {
      const res = await getUserInfo()
      if (res.data.status === 200) {
        store.commit('setUserInfo', res.data.userData)
      }
      console.log(res.data)
    }
  }
}

export default UserModule

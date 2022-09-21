/*
  用户模块 全局定义
*/
import { getUserInfo } from '@/api/user'

const UserModule = {
  namespaced: true,
  state () {
    return {
      userinfo: window.sessionStorage.getItem('userinfo') !== null ? JSON.parse(window.sessionStorage.getItem('userinfo')) : ''
    }
  },
  mutations: {
    setUserInfo (state, value) {
      state.userinfo = value
      sessionStorage.setItem('userinfo', JSON.stringify(state.userinfo))
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

/*
  获取活动列表 全局
*/

import { getActivity } from '@/api/activity'

const ActivityModule = {
  namespaced: true,
  state () {
    return {
      activityList: []
    }
  },

  mutations: {
    setActivity (state, value) {
      state.activityList = value
    }
  },

  actions: {
    async getActivity (store) {
      const res = await getActivity()
      if (res.data.status === 200 || res.data.status === 201) {
        store.commit('setActivity', res.data.ActiData)
      }
      console.log(res.data)
    }
  }
}

export default ActivityModule

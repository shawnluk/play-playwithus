
/*
  获取球员所在球队 全局
*/

import { getTeamInfo, getTeamJoinStatus, getTeamList } from '@/api/team'

const TeamModule = {
  namespaced: true,
  state () {
    return {
      teamInfo: window.sessionStorage.getItem('teamInfo') !== null ? JSON.parse(window.sessionStorage.getItem('teamInfo')) : '',
      teamList: []
    }
  },

  mutations: {

    // 已加入球队
    setTeamInfo1 (state, value) {
      state.teamInfo = value[0]
      sessionStorage.setItem('teamInfo', JSON.stringify(value[0]))
    },

    // 加入球队申请中
    setTeamInfo2 (state, value) {
      state.teamInfo = {
        teamName: value.teamName + '（等待队长同意加入申请）',
        teamID: value.teamID,
        joinStatus: 1
      }
      sessionStorage.setItem('teamInfo', JSON.stringify(state.teamInfo))
    },
    // 没有加入任何球队
    setTeamInfo3 (state, value) {
      sessionStorage.setItem('teamInfo', JSON.stringify(''))
    },

    // 获取所有球队列表
    setTeamList (state, value) {
      state.teamList = []
      for (let i = 0; i < value.length; i++) {
        state.teamList.push({
          id: value[i].id,
          value: value[i].teamName,
          CaptainID: value[i].CaptainID,
          newCaptain: value[i].newCaptain
        })
      }
    }
  },

  actions: {
    async getTeamInfo (store) {
      const res = await getTeamInfo()
      if (res.data.status === 200) {
        store.commit('setTeamInfo1', res.data.teamInfo)
      }
      if (res.data.status === 201) {
        const resJoin = await getTeamJoinStatus()
        console.log(resJoin.data)
        if (resJoin.data.status === 200) {
          store.commit('setTeamInfo2', resJoin.data.joinData)
          return
        }
        store.commit('setTeamInfo3', res.data.status)
        return
      }
      console.log(res.data)
    },
    // 获取所有球队列表
    async getTeamList (store) {
      const res = await getTeamList()
      if (res.data.status === 200) {
        store.commit('setTeamList', res.data.teamList)
      }
    }
  }
}

export default TeamModule

<template>
  <div>
    <h5>球队赛事活动页面</h5>
    <el-button  type="button" class="btn btn-primary" @click="createTeamAction">创建我的活动</el-button>
    <el-button  type="button" class="btn btn-primary" @click="DeleteTeamAction">撤销活动申请</el-button>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'teamActivity',
  data () {
    return {
      userinfo: {
        userID: '',
        username: '',
        password: '',
        nickname: '',
        email: '',
        userpic: '',
        picUrl: ''
      },
      teamInfo: {
        teamName: '',
        teamID: '',
        joinStatus: false,
        activeName: '0',
        checkTeamMemberDisable: false,
        teamMemberList: [],
        joinTeam_memberList: [],
        teamCaptain: '',
        captainID: ''
        // selectCaptain: ''
      }
    }
  },
  methods: {
    createTeamAction () {
      if (this.userinfo.userID !== this.teamInfo.captainID) {
        return alert('你不是球队队长，不能创建活动')
      }
      this.$router.push('/team/createTeamAction')
    },
    DeleteTeamAction () {
      console.log('撤销活动申请')
    }
  },
  created () {
    // 获取个人信息及球队信息
    const token = localStorage.getItem('token')
    if (!token) {
      alert('无登陆信息，请点击立即登陆')
      this.$router.replace('/login')
    } else {
      const url = 'http://127.0.0.1:3030/my/userinfo'
      const res = axios({
        url,
        headers: { Authorization: token }
      })
      res.then(res1 => {
        if (res1.data.status === 0) {
          this.userinfo.userID = res1.data.data.id
          this.userinfo.username = res1.data.data.username
          this.userinfo.nickname = res1.data.data.nickname
          this.userinfo.email = res1.data.data.email
          this.userinfo.userpic = res1.data.data.userpic
          this.teamInfo.teamName = res1.data.data.teamName
          this.teamInfo.teamID = res1.data.data.teamID

          if (this.teamInfo.teamID !== null) {
            const teamMemberRes = axios({
              url: 'http://127.0.0.1:3030/team/memberlist',
              method: 'post',
              headers: { Authorization: token },
              data: {
                teamID: this.teamInfo.teamID
              }
            })
            teamMemberRes.then(res3 => {
              this.teamInfo.teamMemberList = res3.data.data.list1
              this.teamInfo.joinTeam_memberList = res3.data.data.list2
              this.teamInfo.teamCaptain = res3.data.data.list3[0].newCaptain
              this.teamInfo.captainID = res3.data.data.list3[0].CaptainId
              this.teamInfo.teamMemberList.splice(this.teamInfo.teamMemberList.findIndex(item => item.id === this.teamInfo.captainID), 1)
            })
          }
        }
      }).catch(err => {
        console.log(err)
        alert('载入页面出错，请重新登陆')
        this.$router.replace('/login')
      })
    }

    // 获取活动信息
  }
}

</script>

<style lang="less" scoped>

</style>

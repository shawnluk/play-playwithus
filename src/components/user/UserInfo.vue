<template>
  <div>

    <div>用户名：{{userinfo.username}}</div>
    <div>{{userinfo.password}}</div>
    <div>昵称：{{userinfo.nickname}}</div>
    <div>邮箱：{{userinfo.email}}</div>

    <div class="pic">
      头像：
      <img :src='userinfo.picUrl' alt="">
    </div>
    <!-- <div>球队ID:{{teamID}}</div> -->
    <div>球队：{{teamInfo.teamName}}</div>
    <el-button  type="button" class="btn btn-primary" @click="updateData">更新个人资料</el-button>
    <el-button  type="button" class="btn btn-primary" @click="passwordChange">更改密码</el-button>
    <el-button  type="button" class="btn btn-primary" @click="toTeam">查看球队页面</el-button>
    <el-button  type="button" class="btn btn-primary" @click="toActivity">查看活动页面</el-button>
    <el-button  type="button" class="btn btn-primary" @click="logOut">退出登陆</el-button>
  </div>
</template>

<script>

// import axios from 'axios'
// getTeamInfo
// import { getUserInfo } from '@/api/user.js'
// import { getTeamJoinStatus } from '@/api/team.js'

export default {
  inject: ['reload'],
  data () {
    return {
      userinfo: {
        userID: '',
        username: '',
        password: '',
        nickname: '',
        email: '',
        userPic: '',
        picUrl: ''
      },
      teamInfo: {
        teamName: '',
        teamID: '',
        joinStatus: '',
        activeName: '0'
      }
    }
  },
  created () {
    /* 获取用户信息 */
    this.$API.user.getUserInfo().then(resUser => {
      if (resUser.data.status === 200) {
        console.log(resUser.data)
        this.userinfo.userID = resUser.data.userData.id
        this.userinfo.username = resUser.data.userData.username
        this.userinfo.nickname = resUser.data.userData.nickname
        this.userinfo.email = resUser.data.userData.email
        this.userinfo.userPic = resUser.data.userData.userPic

        // 拼接用户头像src
        if (this.userinfo.userPic !== null) {
          const picUrl = 'https://' + this.userinfo.userPic
          this.userinfo.picUrl = picUrl
          this.avatarShow = false
        }
        return
      }
      console.log(resUser.data)
    }).catch(errUser => {
      console.log('获取用户信息失败' + errUser)
    })

    /* 获取用户所在球队信息 */
    this.$API.team.getTeamInfo().then(resTeam => {
      // 已经加入球队
      if (resTeam.data.status === 200) {
        console.log(resTeam.data)
        this.teamInfo.teamName = resTeam.data.teamInfo[0].teamName
        this.teamInfo.teamID = resTeam.data.teamInfo[0].teamID
        this.teamInfo.teamCaptain = resTeam.data.teamInfo[0].newCaptain
        this.teamInfo.captainID = resTeam.data.teamInfo[0].CaptainID
        return
      }
      // 处于球队加入申请状态
      if (resTeam.data.status === 201) {
        this.$API.team.getTeamJoinStatus().then(resJoin => {
          if (resJoin.data.status === 200) {
            console.log(resJoin.data)
            this.teamInfo.teamName = resJoin.data.joinData.teamName + '（等待队长同意加入申请）'
            this.teamInfo.teamID = resJoin.data.joinData.teamID
            return
          }
          if (resJoin.data.status === 201) {
            return console.log(resJoin.data)
          }
          console.log(resJoin.data)
        }).catch(errJoin => {
          console.log('获取球队申请状态失败' + errJoin)
        })
        return
      }
      console.log(resTeam.data)
    }).catch(errTeam => {
      console.log('获取球队信息失败' + errTeam)
    })
  },
  methods: {
    passwordChange () {
      // this.sendToSetPwd()
      this.$router.push('/my/setPassword')
    },
    updateData () {
      console.log('准备更新个人资料')
      this.$router.push('/my/update')
    },
    toTeam () {
      this.$router.push('/team/teaminfo')
    },
    toActivity () {
      this.$router.push('/team/activity')
    },
    logOut () {
      // console.log('准备退出登陆')
      localStorage.removeItem('token')
      this.$router.push('/user/login')
    }
  }
}
</script>

<style lang="less" scoped>
  .pic{
    img{
      width: 100px;
      height: 100px;
      // display: none;
    }
  }

</style>

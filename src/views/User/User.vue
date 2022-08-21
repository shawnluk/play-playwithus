<template>
  <!-- <div><h1>user</h1></div> -->
  <div id="user_wrap">
    <div class="user_img_wrap">
      <div class="user_img">
        <el-avatar icon="el-icon-user-solid" v-if='avatarShow'></el-avatar>
        <el-avatar :src='userinfo.picUrl' v-else></el-avatar>
      </div>
      <el-row>
        <el-button round @click="ToLogin" v-if='loginShow'>立即登陆</el-button>
        <div  v-else>{{this.userinfo.username}}</div>
      </el-row>
    </div>
    <div class="my_data">我的数据</div>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>
    <van-cell-group inset>
      <van-cell title="我的消息" value="" is-link />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="当前赛事" value="查看活动" is-link to='team/activity' />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="我的球队" value="球队设置" is-link to='my/userinfo'>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #label>
          {{teamInfo.teamName}}
          <!-- <van-tag type="danger">标签</van-tag> -->
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="个人资料" value="更改" is-link to="my/userinfo"/>
      <van-cell title="意见反馈" value="" is-link  />
      <van-cell title="分享" value="" is-link />
      <van-cell title="联系客服" value="" is-link />
      <van-cell title="点赞" value="" is-link />
    </van-cell-group>
    <el-row class="user_logout" round>
      <el-button round @click="logOut">退出登陆</el-button>
    </el-row>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'User',
  inject: ['reload'],
  data () {
    return {
      activeName: '1',
      // nameShow: '',
      loginShow: true,
      avatarShow: true,
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
  created () {
    const token = localStorage.getItem('token')
    if (!token) {
      // this.$router.push('/user/login')
      alert('无登陆信息，请点击立即登陆')
    } else {
      const url = 'http://127.0.0.1:3030/my/userinfo'
      const res = axios({
        url,
        headers: { Authorization: token }
      })
      // console.log(res)
      res.then(res1 => {
        console.log(res1)
        if (res1.data.status === 0) {
          this.userinfo.userID = res1.data.data.id
          this.userinfo.username = res1.data.data.username
          this.userinfo.nickname = res1.data.data.nickname
          this.userinfo.email = res1.data.data.email
          this.userinfo.userpic = res1.data.data.userpic
          this.teamInfo.teamName = res1.data.data.teamName
          this.teamInfo.teamID = res1.data.data.teamID

          if (this.userinfo.username) {
            this.loginShow = false
          }

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

              // if (this.userinfo.userID === this.teamInfo.captainID) {
              //   this.el_popoverDisable = false
              // }
            })
          }

          if (res1.data.data.teamID === null) {
            this.teamInfo.checkTeamMemberDisable = true
          }

          if (this.userinfo.userpic !== null) {
            const picSrcArr = this.userinfo.userpic.split('\\').filter((item, index, array) => {
              return index > 0
            })
            // console.log(picSrcArr)
            let str = ''
            for (const item of picSrcArr) {
              str += '/' + item
            }

            const picUrl = 'http://127.0.0.1:3030' + str
            // console.log(picUrl)
            this.userinfo.picUrl = picUrl
            this.avatarShow = false
          }

          if (this.teamInfo.teamName === null) {
            // console.log(token)
            // console.log('还没申请球队，准备查看申请状态')
            const url = 'http://127.0.0.1:3030/team/joinstatus'
            const res2 = axios.post(url, { userID: this.userinfo.userID, username: this.userinfo.username })
            res2.then(res2 => {
              // console.log(res2.data.message)
              if (res2.data.message.joinStatus === 1) {
                this.teamInfo.teamName = res2.data.message.teamName + '(等待申请通过)'
                // console.log('正在申请球队')
                this.teamInfo.joinStatus = true
                this.teamInfo.teamID = res2.data.message.teamID
                // console.log(this.joinStatus)
              }
              if (res2.data.message.joinStatus === 0) {
                this.teamInfo.teamName = null
                this.teamInfo.joinStatus = false
              }
            })
          }
        }
        if (res1.data.status === 403) {
          alert(JSON.stringify(res1.data))
        }
      })
      // .catch((err) => {
      //   console.log(err)
      //   Object.assign(this.$data, this.$options.data())
      //   // localStorage.removeItem('token')
      // })
    }

    // 获取teamMemBer list
  },
  methods: {
    logOut () {
      // this.reload()
      localStorage.removeItem('token')
      Object.assign(this.$data, this.$options.data())
    },
    ToLogin () {
      this.$router.push('/user/login')
      // const _this = this
      // if (!localStorage.getItem('token')) {
      // } else {
      //   const oldToken = localStorage.getItem('token')
      //   const url = 'http://127.0.0.1:3030/my/userinfo'
      //   async function getToken () {
      //     const { data: res } = await axios({
      //       method: 'get',
      //       url: url,
      //       headers: { Authorization: oldToken }
      //     })
      //     if (res.status === 0) {
      //       _this.$router.push('/my/userinfo')
      // console.log(res.data)
      // console.log('登陆成功')
      // _this.userInfo.username = res.data.username
      // _this.userInfo.teamName = res.data.teamName
      // this.userInfo.userpic = res.data.userpic
      // const picSrcArr = res.data.userpic.split('\\').filter((item, index, array) => {
      //   return index > 0
      // })
      // // console.log(picSrcArr)
      // let str = ''
      // for (const item of picSrcArr) {
      //   str += '/' + item
      // }

      // const picUrl = 'http://127.0.0.1:3030' + str
      // // console.log(picUrl)
      // _this.userInfo.userpic = picUrl

      // if (_this.userInfo.username) {
      //   _this.loginShow = false
      // }
      // }
      // if (res.status === 403) {
      // alert({
      //   message:res.message,
      //   status：res.status
      // })
      // console.log(res.message)
      //   alert(JSON.stringify(res))
      //   _this.$router.push('/user/login')
      // }
      // }
      // getToken()
      // }
    }
  }
}
</script>

<style lang="less" scoped>
  .user_img_wrap{
    width: 100%;
    height: 120px;
    background-color: rgb(15, 112, 202);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    .user_img{
      margin-bottom: 5px;
    }
    .el-button{
      width: 50%;
    }
  }
  .my_data{
    font-size: 13px;
    margin: 5px 0;
  }
  .el-row {
  margin-bottom: 20px;
  // margin-top: 20px;
  &:last-child {
    margin-bottom: 0;
  }
 }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #e5e9f2;
  }
  .bg-purple {
    background: #e5e9f2;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .van-cell-group{
    border: 1px solid gray;
    margin-top: 20px;
  }
  .user_logout{
    text-align: center;
    margin-top: 30px;
    .el-button{
      background-color: red;
      color: black;
      // font-size: 16px;
      width: 50%;
    }
  }
</style>

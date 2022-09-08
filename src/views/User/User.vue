<template>
  <!-- <div><h1>user</h1></div> -->
  <div id="user_wrap">
    <div class="user_img_wrap">
      <div class="user_img">
        <el-avatar icon="el-icon-user-solid" v-if='avatarShow'></el-avatar>
        <el-avatar :src='this.$store.state.user.userPic' v-else></el-avatar>
      </div>
      <el-row>
        <el-button round @click="ToLogin" v-if='loginShow'>立即登陆</el-button>
        <div  v-else>{{this.username}}</div>
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
      <van-cell title="当前赛事" value="查看活动" is-link to='/activity/list' />
    </van-cell-group>
    <van-cell-group inset>
      <van-cell title="我的球队" value="球队设置" is-link to='team/teamCenter'>
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
import { mapState, mapActions } from 'vuex'
// import { mapActions } from 'vuex'
// import { mapMutations } from 'vuex'

export default {
  name: 'User',
  inject: ['reload'],
  data () {
    return {
      activeName: '1',
      // nameShow: '',
      loginShow: true,
      avatarShow: true,
      // userinfo: {
      //   userID: '',
      //   username: '',
      //   password: '',
      //   nickname: '',
      //   email: '',
      //   userPic: '',
      //   picUrl: ''
      // },
      teamInfo: {
        teamName: '',
        teamID: '',
        joinStatus: false,
        activeName: '0',
        checkTeamMemberDisable: false,
        teamMemberList: [],
        joinTeam_memberList: [],
        teamCaptain: '',
        captainID: '',
        teamPic: ''
        // selectCaptain: ''
      }

    }
  },
  created () {
    this.getUserInfo()
    // this.logIn()
    const isLogin = sessionStorage.getItem('isLogin')
    console.log(isLogin)
    // console.log(this.username)
    if (isLogin === 1) {
      this.loginShow = false
      this.avatarShow = false
    }
    /* 获取用户信息 */
    // this.$API.user.getUserInfo().then(resUser => {
    //   if (resUser.data.status === 200) {
    //     console.log(resUser.data)
    //     this.userinfo.userID = resUser.data.userData.id
    //     this.userinfo.username = resUser.data.userData.username
    //     this.userinfo.nickname = resUser.data.userData.nickname
    //     this.userinfo.email = resUser.data.userData.email
    //     this.userinfo.userPic = resUser.data.userData.userPic

    //     this.loginShow = false
    //     // 拼接用户头像src
    //     if (this.userinfo.userPic !== null) {
    //       const picUrl = 'https://' + this.userinfo.userPic
    //       this.userinfo.picUrl = picUrl
    //       this.avatarShow = false
    //     }
    //     return
    //   }
    //   console.log(resUser.data)
    // }).catch(errUser => {
    //   console.log('获取用户信息失败' + errUser)
    // })

    /* 获取用户所在球队信息 */
    this.$API.team.getTeamInfo().then(resTeam => {
      // 已经加入球队
      if (resTeam.data.status === 200) {
        console.log(resTeam.data)
        this.teamInfo.teamName = resTeam.data.teamInfo[0].teamName
        this.teamInfo.teamID = resTeam.data.teamInfo[0].id
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

    // if (this.userinfo.userPic !== null) {
    //   // const picSrcArr = this.userinfo.userPic.split('\\').filter((item, index, array) => {
    //   //   return index > 0
    //   // })
    //   // // console.log(picSrcArr)
    //   // let str = ''
    //   // for (const item of picSrcArr) {
    //   //   str += '/' + item
    //   // }

    //   // const picUrl = 'http://127.0.0.1:3030' + str
    //   const picUrl = 'https://' + this.userinfo.userPic
    //   // console.log(picUrl)
    //   this.userinfo.picUrl = picUrl
    //   this.avatarShow = false
    // }
  },
  mounted () {
    console.log(sessionStorage.getItem('isLogin'))
  },
  methods: {
    ...mapActions('user', ['getUserInfo']),
    // ...mapMutations('user', ['setUserInfo']),
    logOut () {
      // this.reload()
      localStorage.removeItem('token')
      sessionStorage.removeItem('isLogin')
      Object.assign(this.$data, this.$options.data())
    },
    ToLogin () {
      this.$router.push('/user/login')
    }
  },
  computed: {
    ...mapState({
      username: (state) => {
        return state.user.username
      }
    })
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

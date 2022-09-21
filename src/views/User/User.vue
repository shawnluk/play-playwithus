<template>
  <!-- <div><h1>user</h1></div> -->
  <div id="user_wrap">
    <div class="user_img_wrap">
      <div class="user_img">
        <el-avatar icon="el-icon-user-solid" v-if='avatarShow'></el-avatar>
        <el-avatar :src='this.$store.state.user.userinfo.userPic' v-else></el-avatar>
      </div>
      <el-row>
        <el-button round @click="ToLogin" v-if='loginShow'>立即登陆</el-button>
        <!-- <div  v-else>{{this.username}}</div> -->
        <div  v-else>{{$store.state.user.userinfo.username}}</div>
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
        <template #label>
          {{$store.state.team.teamInfo.teamName}}
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
      <!-- <el-button round @click="refresh">刷新</el-button> -->
    </el-row>
  </div>

</template>

<script>
// import { mapState, mapActions } from 'vuex'
// import { mapActions } from 'vuex'

export default {
  name: 'User',
  inject: ['reload'],
  data () {
    return {
      loginShow: true,
      avatarShow: true
    }
  },
  created () {
    /* 获取用户信息 */
    // this.getUserInfo()

    /* 获取用户所在球队信息 */
    // this.getTeamInfo()
  },

  mounted () {
  },
  methods: {
    // ...mapActions('user', ['getUserInfo']),
    // ...mapActions('team', ['getTeamInfo']),
    logOut () {
      localStorage.removeItem('token')
      // Object.assign(this.$data, this.$options.data())

      sessionStorage.clear()
      // this.reload()
      this.$router.go(0)
    },
    ToLogin () {
      this.$router.push('/user/login')
    }
    // refresh () {
    //   this.reload()
    // }

  },
  computed: {
    // ...mapState({
    //   username: (state) => {
    //     return state.user.username
    //   }
    // })
  },
  watch: {
    '$store.state.user.userinfo.username': {
      handler: function (newValue, oldValue) {
        // console.log(newValue)
        if (newValue) {
          this.loginShow = false
        }
      },
      immediate: true
    },
    '$store.state.user.userinfo.userPic': {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.avatarShow = false
        }
      },
      immediate: true
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

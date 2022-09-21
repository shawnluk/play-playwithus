<template>
  <div>

    <div>用户名：{{this.$store.state.user.userinfo.username}}</div>
    <div>{{this.$store.state.user.userinfo.password}}</div>
    <div>昵称：{{this.$store.state.user.userinfo.nickname}}</div>
    <div>邮箱：{{this.$store.state.user.userinfo.email}}</div>

    <div class="pic">
      头像：
      <img :src='this.$store.state.user.userinfo.userPic' alt="">
    </div>
    <!-- <div>球队ID:{{teamID}}</div> -->
    <div>球队：{{this.$store.state.team.teamInfo.teamName}}</div>
    <el-button  type="button" class="btn btn-primary" @click="updateData">更新个人资料</el-button>
    <el-button  type="button" class="btn btn-primary" @click="passwordChange">更改密码</el-button>
    <el-button  type="button" class="btn btn-primary" @click="toTeam">查看球队页面</el-button>
    <el-button  type="button" class="btn btn-primary" @click="toActivity">查看活动页面</el-button>
    <el-button  type="button" class="btn btn-primary" @click="logOut">退出登陆</el-button>
  </div>
</template>

<script>

export default {
  inject: ['reload'],
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    passwordChange () {
      // this.sendToSetPwd()
      this.$router.push('/my/setPassword')
    },
    updateData () {
      // console.log('准备更新个人资料')
      this.$router.push('/my/update')
    },
    toTeam () {
      this.$router.push('/team/teamCenter')
    },
    toActivity () {
      this.$router.push('/activity/list')
    },
    logOut () {
      // console.log('准备退出登陆')
      localStorage.removeItem('token')
      // sessionStorage.setItem('userinfo', JSON.stringify(''))
      // sessionStorage.setItem('teamInfo', JSON.stringify(''))
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

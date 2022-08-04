<template>
  <div>
    <!-- <van-cell-group>
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" label="描述信息" />
    </van-cell-group> -->
    <div>用户名：{{username}}</div>
    <div>{{password}}</div>
    <div>昵称：{{nickname}}</div>
    <div>邮箱：{{email}}</div>
    <div>头像：{{userpic}}</div>
    <!-- <div>球队ID:{{teamID}}</div> -->
    <div>球队：{{teamName}}</div>
    <button type="button" class="btn btn-primary" @click="createTeam">创建我的球队</button>
    <button type="button" class="btn btn-primary" @click="joinTeam">加入球队</button>
    <button type="button" class="btn btn-primary" @click="logOut">退出登陆</button>
  </div>
</template>

<script>
// import getUserinfo from '@/utils/getUserinfo.js'
import axios from 'axios'

export default {
  data () {
    return {
      username: '',
      password: '',
      nickname: '',
      email: '',
      userpic: '',
      teamName: ''
      // teamID: ''
    }
  },
  created () {
    // console.log('userinfo:' + localStorage.getItem('token'))
    // const res = getUserinfo()
    // res.then(res1 => {
    //   // console.log(res1)
    //   this.username = res1.data.username
    //   this.nickname = res1.data.nickname
    //   this.email = res1.data.email
    //   this.userpic = res1.data.userpic
    // })
    // getUserinfo().then(res => {
    //   console.log(res)
    //   this.username = 'a'
    //   this.nickname = res.data.nickname
    //   this.email = res.data.email
    //   this.userpic = res.data.userpic
    // })
    // console.log(res)
    // const res = getUserinfo()
    // console.log(res)
    // --------------------------
    const token = localStorage.getItem('token')
    const url = 'http://127.0.0.1:3030/my/userinfo'
    const res = axios({
      url,
      headers: { Authorization: token }
    })
    // console.log(res)
    res.then(res1 => {
      console.log(res1)
      this.username = res1.data.data.username
      this.nickname = res1.data.data.nickname
      this.email = res1.data.data.email
      this.userpic = res1.data.data.userpic
      // this.teamID = res1.data.data.teamID
      this.teamName = res1.data.data.teamName
    })
  },
  methods: {
    joinTeam () {
      this.$router.push('/team/join')
    },
    createTeam () {
      // console.log('正在准备创建球队')
      if (this.teamName !== null) {
        return alert('球队名不为空')
      }

      this.$router.push('/team/create')
    },
    logOut () {
      // console.log('准备退出登陆')
      localStorage.removeItem('token')
      this.$router.push('/user/login')
    }
  }
  // ----------------
  // const res = getUserinfo()
  // // console.log(res)
  // res.then(res1 => {
  //   // console.log(res1)
  //   this.username = res1.data.username
  //   this.nickname = res1.data.nickname
  //   this.email = res1.data.email
  //   this.userpic = res1.data.userpic
  // })
  // ------------
  // this.reFresh()
  // activated () {
  //   this.reFresh()
  // },
  // methods: {
  //   reFresh () {
  //     const res = getUserinfo()
  //     // console.log(res)
  //     res.then(res1 => {
  //       // console.log(res1)
  //       this.username = res1.data.username
  //       this.nickname = res1.data.nickname
  //       this.email = res1.data.email
  //       this.userpic = res1.data.userpic
  //     })
  //   }
  // }
  // watch: {
  //   $router () {
  //     this.reFresh()
  //     console.log('路由变化')
  //   },
  //   reFresh () {
  //     console.log('路由变化')
  //   }
  // }
}
</script>

<style lang="less" scoped>

</style>

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
    <button type="button" class="btn btn-primary" @click="QuitTeam">退出球队</button>
    <button type="button" class="btn btn-primary" @click="DeleteTeamJoin">撤销申请</button>
    <button type="button" class="btn btn-primary" @click="logOut">退出登陆</button>
  </div>
</template>

<script>
// import getUserinfo from '@/utils/getUserinfo.js'
import axios from 'axios'

export default {
  data () {
    return {
      userID: '',
      username: '',
      password: '',
      nickname: '',
      email: '',
      userpic: '',
      teamName: '',
      teamID: '',
      joinStatus: false
    }
  },
  // mounted () {
  //   console.log(this.joinStatus)
  // },
  created () {
    // console.log(this.joinStatus)
    // console.log(this.teamID)
    const token = localStorage.getItem('token')
    const url = 'http://127.0.0.1:3030/my/userinfo'
    const res = axios({
      url,
      headers: { Authorization: token }
    })
    // console.log(res)
    res.then(res1 => {
      console.log(res1)
      this.userID = res1.data.data.id
      this.username = res1.data.data.username
      this.nickname = res1.data.data.nickname
      this.email = res1.data.data.email
      this.userpic = res1.data.data.userpic
      // this.teamID = res1.data.data.teamID
      this.teamName = res1.data.data.teamName
      // console.log(this.teamName)
      if (this.teamName === null) {
        // console.log(token)
        // console.log('还没申请球队，准备查看申请状态')
        const url = 'http://127.0.0.1:3030/team/joinstatus'
        const res2 = axios.post(url, { userID: this.userID })
        res2.then(res2 => {
          console.log(res2.data.message)
          if (res2.data.message.joinStatus === 1) {
            this.teamName = res2.data.message.teamName + '(等待申请通过)'
            // console.log('正在申请球队')
            this.joinStatus = true
            this.teamID = res2.data.message.teamID
          }
          if (res2.data.message.joinStatus === 0) {
            this.teamName = null
          }
        })
      }
    })
  },
  methods: {
    QuitTeam () {},
    async DeleteTeamJoin () {
      // console.log(this.teamID)
      const resConfirm = confirm('确认要撤销你的球队加入申请吗？')
      if (!this.joinStatus) {
        alert('你没有申请球队,请勿乱按')
        return
      }
      // console.log(res)
      if (resConfirm) {
        // console.log('准备发起撤销申请')
        // const { data: res } = await axios.post('http://127.0.0.1:3030/team/deleteJoinStatus', { userID: this.userID })
        const { data: res } = await axios.post('http://127.0.0.1:3030/team/deleteJoinStatus', { userID: this.userID })
        console.log(res)
      }
    },
    joinTeam () {
      // console.log(this.teamName)
      if (this.teamName !== null) {
        return alert('已加入球队，不能再申请加入其他球队')
      }
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

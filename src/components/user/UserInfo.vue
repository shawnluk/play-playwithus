<template>
  <div>
    <!-- <van-cell-group>
      <van-cell title="单元格" value="内容" />
      <van-cell title="单元格" value="内容" label="描述信息" />
    </van-cell-group> -->
    <div>用户名：{{userinfo.username}}</div>
    <div>{{userinfo.password}}</div>
    <div>昵称：{{userinfo.nickname}}</div>
    <div>邮箱：{{userinfo.email}}</div>
    <!-- <div>头像：{{userpic}}</div> -->
    <div class="pic">
      头像：
      <img :src='userinfo.picUrl' alt="">
    </div>
    <!-- <div>球队ID:{{teamID}}</div> -->
    <div>球队：{{teamInfo.teamName}}</div>
    <el-button  type="button" class="btn btn-primary" @click="updateData">更新个人资料</el-button>
    <el-button  type="button" class="btn btn-primary" @click="pwdChange">更改密码</el-button>
    <el-button  type="button" class="btn btn-primary" @click="createTeam">创建我的球队</el-button>
    <el-button  type="button" class="btn btn-primary" @click="joinTeam">加入球队</el-button>
    <!-- <button type="button" class="btn btn-primary" @click="QuitTeam">退出球队</button> -->
    <el-button  type="button" class="btn btn-primary" @click="createTeamAction">创建活动</el-button>
    <el-button  type="button" class="btn btn-primary" @click="DeleteTeamJoin">撤销申请</el-button>
    <el-button  type="button" class="btn btn-primary" @click="logOut">退出登陆</el-button>
    <el-popover
      placement="right"
      width="400"
      trigger="click"
      :disabled='el_popoverDisable'>
      <!-- <el-table :data="teamInfo.teamMemberList">
        <el-table-column width="150" property="id" label="id"></el-table-column>
        <el-table-column width="100" property="username" label="姓名"></el-table-column>
      </el-table> -->
        <el-select v-model="value" placeholder="请先选择新队长" @change = 'selectCaptain'>
          <el-option
            v-for="item in teamInfo.teamMemberList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
            >
          </el-option>
        </el-select>
      <el-button slot="reference" @click="QuitTeam" type="button" class="btn btn-primary">退出球队</el-button>
    </el-popover>
    <van-collapse v-model="teamInfo.activeName" accordion >
      <van-collapse-item title="查看我的球队成员"
      name="1"
      :disabled="teamInfo.checkTeamMemberDisable"
      >
        <div> 队长：{{this.teamInfo.teamCaptain}}</div>
        <div v-for=" item in teamInfo.teamMemberList" :key='item.id'
        >
        {{item.username}}
        </div>
        <div v-for="item in teamInfo.joinTeam_memberList" :key = 'item.id'
        >
        等待申请通过：
        {{item.username}}
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
// import getUserinfo from '@/utils/getUserinfo.js'
import axios from 'axios'
// import bus from '@/router/eventBus.js'

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
      },
      el_popoverDisable: true,
      value: ''
      // userID: '',
      // username: '',
      // password: '',
      // nickname: '',
      // email: '',
      // userpic: '',
      // picUrl: '',
      // teamName: '',
      // teamID: '',
      // joinStatus: false,
      // activeName: '0',
      // checkTeamMemberDisable: false,
      // teamMemberList: [],
      // newTeamMemberList: [],
      // joinTeam_memberList: [],
      // teamCaptain: '',
      // captainID: ''
    }
  },
  created () {
    const token = localStorage.getItem('token')
    const url = 'http://127.0.0.1:3030/my/userinfo'
    const res = axios({
      url,
      headers: { Authorization: token }
    })
    // console.log(res)
    res.then(res1 => {
      console.log(res1)
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
    })

    // 获取teamMemBer list
  },
  // beforeDestroy () {
  //   bus.$emit('share', this.username)
  // },
  methods: {
    async selectCaptain (selectCaptain) {
      console.log(selectCaptain)
      const newCaptainObj = this.teamInfo.teamMemberList.filter(item => item.username === selectCaptain)
      const { data: res } = await axios.post('http://127.0.0.1:3030/team/quit', {
        userID: this.userinfo.userID,
        teamID: this.teamInfo.teamID,
        newCaptain: newCaptainObj[0]
      })
      if (res.status === 200) {
        this.teamInfo.teamName = ''
        alert(JSON.stringify(res))
        this.reload()
      }
    },
    createTeamAction () {
      if (this.userinfo.userID !== this.teamInfo.captainID) {
        return alert('你不是球队队长，不能创建活动')
      }
      this.$router.push('/team/createTeamActivity')
    },
    pwdChange () {
      // this.sendToSetPwd()
      this.$router.push('/my/setPassword')
    },
    updateData () {
      console.log('准备更新个人资料')
      this.$router.push('/my/update')
    },
    async QuitTeam () {
      // this.el_popoverDisable = true
      if (this.teamInfo.joinStatus) {
        return alert('球队申请中，请选择撤销申请')
      }
      if (this.teamInfo.teamName === null) {
        return alert('你还未加入任何球队')
      }
      // console.log(res)
      if (confirm('你是否要退出球队：' + this.teamInfo.teamName)) {
        // console.log(this.teamMemberList)
        if (this.userinfo.userID !== this.teamInfo.captainID || this.teamMemberList !== true) {
          const { data: res } = await axios.post('http://127.0.0.1:3030/team/quit', {
            userID: this.userinfo.userID,
            teamID: this.teamInfo.teamID
          })
          if (res.status === 200) {
            this.teamInfo.teamName = ''
            alert(JSON.stringify(res))
            this.reload()
          }
        }
      } else {
        this.reload()
      }
    },
    async DeleteTeamJoin () {
      // console.log(this.teamID)
      const resConfirm = confirm('确认要撤销你的球队加入申请吗？')
      // console.log(this.joinStatus)
      if (!this.teamInfo.joinStatus) {
        alert('你没有申请球队,请勿乱按')
        return
      }
      // console.log(res)
      if (resConfirm) {
        // console.log('准备发起撤销申请')
        const { data: res } = await axios.post('http://127.0.0.1:3030/team/deleteJoinStatus', { userID: this.userinfo.userID })
        // console.log(res)
        if (res.status === 0 && res.message === '已收到撤销申请') {
          this.teamInfo.teamName = null
          this.teamInfo.joinStatus = false
        }
        // console.log(this.joinStatus)
      }
    },
    joinTeam () {
      // console.log(this.teamName)
      if (this.teamInfo.teamName !== null) {
        return alert('已加入球队，不能再申请加入其他球队')
      }
      this.$router.push('/team/join')
    },
    createTeam () {
      // console.log('正在准备创建球队')
      if (this.teamInfo.teamName !== null) {
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

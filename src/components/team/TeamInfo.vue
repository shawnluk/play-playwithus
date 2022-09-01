<template>
  <div>
    <h5>球队信息页面</h5>
    <div>球队：{{teamInfo.teamName}}</div>
    <div class="pic">
      头像：
      <img :src='teamInfo.teamPic' alt="">
    </div>
    <el-button  type="button" class="btn btn-primary" @click="createTeam">创建我的球队</el-button>
    <el-button  type="button" class="btn btn-primary" @click="joinTeam">加入球队</el-button>
    <el-button  type="button" class="btn btn-primary" @click="toActivity">查看活动</el-button>
    <el-button  type="button" class="btn btn-primary" @click="DeleteTeamJoin">撤销申请</el-button>
    <el-button  type="button" class="btn btn-primary" @click="setTeamInfo">修改球队资料</el-button>
    <!-- <el-button> -->
    <el-popover
    placement="right"
    width="400"
    trigger="click"
    :disabled='el_popoverDisable'

    >
    <!-- <el-table :data="teamInfo.teamMemberList">
      <el-table-column width="150" property="id" label="id"></el-table-column>
      <el-table-column width="100" property="username" label="姓名"></el-table-column>
    </el-table> -->
      <el-select v-model="value" placeholder="请先选择新队长" @change='selectCaptain'>
        <el-option
          v-for="item in teamInfo.teamMemberList"
          :key="item.id"
          :label="item.username"
          :value="item.username"
          >
        </el-option>
      </el-select>
      <el-button  slot="reference" @click="QuitTeam" type="button" class="btn btn-primary">
        退出球队
      </el-button>
    </el-popover>
    <!-- </el-button> -->
    <van-collapse v-model="teamInfo.activeName" accordion >
      <van-collapse-item title="查看我的球队成员"
      name="1"
      :disabled="teamInfo.checkTeamMemberDisable"
      >
        <div> 队长：</div>
        <div> =======>>{{this.teamInfo.teamCaptain}}</div>
        <div> 队员：{{this.teamInfo.noMember}}</div>
        <div v-for=" item in teamInfo.teamMemberList" :key='item.id'
        >
        =======>>{{item.username}}
        </div>
        <div>等待申请通过：{{this.teamInfo.noJoin}}</div>
        <div v-for=" item in teamInfo.joinTeam_memberList" :key='item.id'
        >
        =======>>{{item.username}}
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>

// import axios from 'axios'
// import { getUserInfo } from '@/api/user.js'
// import { getTeamInfo, getTeamJoinStatus } from '@/api/team.js'

export default {
  name: 'TeamInfo',
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
        noMember: 'null',
        noJoin: 'null',
        teamName: '',
        teamID: '',
        joinStatus: 0,
        activeName: '0',
        checkTeamMemberDisable: true,
        teamMemberList: [{ username: '无' }],
        joinTeam_memberList: [{ username: '无' }],
        teamCaptain: '',
        captainID: '',
        teamPic: ''
        // selectCaptain: ''
      },
      el_popoverDisable: true,
      value: ''
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
        this.teamInfo.checkTeamMemberDisable = false
        this.teamInfo.teamName = resTeam.data.teamInfo[0].teamName
        this.teamInfo.teamID = resTeam.data.teamInfo[0].id
        this.teamInfo.teamCaptain = resTeam.data.teamInfo[0].newCaptain
        this.teamInfo.captainID = resTeam.data.teamInfo[0].CaptainID
        this.teamInfo.teamPic = 'https://' + resTeam.data.teamInfo[0].teamPic

        /*  获取球员列表 */
        const data = { teamID: this.teamInfo.teamID }

        this.$API.team.getTeamMember(data).then(resMember => {
          if (resMember.data.status === 200) {
            console.log(resMember.data)
            this.teamInfo.teamMemberList = resMember.data.memberData.list1
            this.teamInfo.teamMemberList.splice(this.teamInfo.teamMemberList.findIndex(item => item.id === this.teamInfo.captainID), 1)
            this.teamInfo.joinTeam_memberList = resMember.data.memberData.list2

            if (this.teamInfo.teamMemberList.length !== 0) {
              this.el_popoverDisable = false
            }
            if (this.teamInfo.teamMemberList.length !== 0) {
              this.teamInfo.noMember = ''
            }
            if (this.teamInfo.joinTeam_memberList.length !== 0) {
              this.teamInfo.noJoin = ''
            }
            return
          }
          // if (resMember.data.status === 400) {
          //   // return alert('提交了错误的teamID')
          //   return console.log(resMember.data)
          // }
          console.log(resMember.data)
        }).catch(errMember => {
          console.log('errMember' + errMember)
        })

        return
      }
      // 处于球队加入申请状态
      if (resTeam.data.status === 201) {
        this.$API.team.getTeamJoinStatus().then(resJoin => {
          if (resJoin.data.status === 200) {
            console.log(resJoin.data)
            this.teamInfo.teamName = resJoin.data.joinData.teamName + '（等待队长同意加入申请）'
            this.teamInfo.teamID = resJoin.data.joinData.teamID
            this.teamInfo.joinStatus = resJoin.data.joinData.joinStatus
            return
          }
          // if (resJoin.data.status === 201) {
          //   return console.log(resJoin.data)
          // }

          return console.log(resJoin.data)
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

  // beforeDestroy () {
  //   bus.$emit('share', this.username)
  // },
  methods: {
    selectCaptain (selectCaptain) {
      // console.log(selectCaptain)
      const newCaptainObj = this.teamInfo.teamMemberList.filter(item => item.username === selectCaptain)
      const data = {
        teamID: this.teamInfo.teamID,
        newCaptain: newCaptainObj[0]
      }
      this.$API.team.teamQuit(data).then(resQuit => {
        console.log(resQuit.data)
        this.reload()
      }).catch(errQuit => {
        console.log('errQuit' + errQuit)
      })
    },
    QuitTeam () {
      // this.el_popoverDisable = true
      if (this.teamInfo.joinStatus === 1) {
        return alert('球队申请中，请选择撤销申请')
      }
      if (this.teamInfo.teamName === null) {
        return alert('你还未加入任何球队')
      }

      if (confirm('你是否要退出球队：' + this.teamInfo.teamName)) {
        // .......................
        // 队员退出球队
        if (this.userinfo.userID !== this.teamInfo.captainID) {
          this.el_popoverDisable = true
          const data = {
            teamID: this.teamInfo.teamID,
            newCaptain: ''
          }
          this.$API.team.teamQuit(data).then(resQuit => {
            console.log(resQuit.data)
            this.reload()
          }).catch(errQuit => {
            console.log('errQuit' + errQuit)
          })
          return
        }
        // .......................
        // 只有队长一人,退出球队
        if (this.userinfo.userID === this.teamInfo.captainID && this.teamInfo.teamMemberList.length === 0) {
          if (confirm('此操作是要删除球队：' + this.teamInfo.teamName)) {
            const data = {
              teamID: this.teamInfo.teamID
            }
            this.$API.team.teamDelete(data).then(resDelete => {
              console.log(resDelete.data)
            }).catch(errDelete => {
              console.log('errDelete' + errDelete)
            })
          }
          return false
        }
        this.el_popoverDisable = false
      } else {
        this.reload()
      }
    },
    DeleteTeamJoin () {
      if (!this.teamInfo.joinStatus) {
        alert('你没有申请球队,请勿乱按')
        return
      }

      this.$API.team.DeleteJoinStatus().then(res => {
        console.log(res.data)
        this.reload()
      }).catch(err => {
        console.log(err)
      })
    },
    toActivity () {
      this.$router.push('/team/Activity')
    },
    joinTeam () {
      if (this.teamInfo.teamName !== '') {
        return alert('已加入球队，不能再申请加入其他球队')
      }
      this.$router.push('/team/join')
    },
    createTeam () {
      if (this.teamInfo.teamName !== '') {
        return alert('球队名不为空,已加入球队')
      }
      this.$router.push('/team/create')
    },
    setTeamInfo () {
      if (this.teamInfo.teamName === '') {
        return alert('你还未加入任何球队')
      }
      if (this.userinfo.userID !== this.teamInfo.captainID) {
        return alert('你不是球队队长，不能修改球队资料')
      }
      this.$router.push('/team/SetTeamInfo')
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
  .el-popover__reference{
    margin-left: 10px;
  }
</style>

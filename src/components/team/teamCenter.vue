<template>
  <div>
    <h5>球队信息页面</h5>
    <div>球队：{{this.$store.state.team.teamInfo.teamName}}</div>
    <div class="pic">
      头像：
      <img :src='this.$store.state.team.teamInfo.teamPic' alt="">
    </div>
    <el-button  type="button" class="btn btn-primary" @click="createTeam">创建我的球队</el-button>
    <el-button  type="button" class="btn btn-primary" @click="joinTeam">加入球队</el-button>
    <el-button  type="button" class="btn btn-primary" @click="toActivity">查看活动</el-button>
    <el-button  type="button" class="btn btn-primary" @click="DeleteTeamJoin">撤销申请</el-button>
    <el-button  type="button" class="btn btn-primary" @click="setTeamInfo">修改球队资料</el-button>
    <el-button  type="button" class="btn btn-primary" @click="ToMessageCenter">球队消息界面</el-button>
    <!-- <el-button> -->
    <el-popover
    placement="right"
    width="400"
    trigger="click"
    :disabled='el_popoverDisable'
    >
      <el-select v-model="value" placeholder="请先选择新队长" @change='selectCaptain'>
        <el-option
          v-for="item in teamMemberList"
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
    <van-collapse v-model="activeName" accordion >
      <van-collapse-item title="查看我的球队成员"
      name="1"
      :disabled="checkTeamMemberDisable"
      >
        <div> 队长：</div>
        <div> =======>>{{this.$store.state.team.teamInfo.newCaptain}}</div>
        <div> 队员：{{this.noMember}}</div>
        <div v-for=" item in teamMemberList" :key='item.id'
        >
        =======>>{{item.username}}
        </div>
        <div>等待申请通过：{{this.noJoin}}</div>
        <div v-for=" item in joinTeam_memberList" :key='item.id'
        >
        =======>>{{item.username}}
        </div>
      </van-collapse-item>
    </van-collapse>
    <button type="button" class="btn btn-primary" @click="toIndex" >回到用户中心</button>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
export default {
  name: 'TeamInfo',
  inject: ['reload'],
  data () {
    return {
      noMember: 'null',
      noJoin: 'null',
      activeName: '0',
      checkTeamMemberDisable: true,
      teamMemberList: [{ username: '无' }],
      joinTeam_memberList: [{ username: '无' }],
      el_popoverDisable: true,
      value: ''
    }
  },
  created () {
    // ··········································
    // 获取球员列表
    if (this.$store.state.team.teamInfo !== '' && this.$store.state.team.teamInfo.joinStatus === undefined) {
      const data = { teamID: this.$store.state.team.teamInfo.id }
      this.$API.team.getTeamMember(data).then(result => {
        console.log(result.data)
        if (result.data.status === 200) {
          this.teamMemberList = result.data.memberList[0].filter(item => item.userID !== this.$store.state.team.teamInfo.CaptainID)
          this.joinTeam_memberList = result.data.memberList[1]
          if (this.teamMemberList.length !== 0) {
            this.el_popoverDisable = false
          }
          if (this.teamMemberList.length !== 0) {
            this.noMember = ''
          }
          if (this.joinTeam_memberList.length !== 0) {
            this.noJoin = ''
          }
        }
      })
      this.checkTeamMemberDisable = false
    }
  },

  methods: {
    ...mapActions('team', ['getTeamInfo']),

    ToMessageCenter () {
      if (this.$store.state.user.userinfo.id !== this.$store.state.team.teamInfo.CaptainID) {
        return console.log('你不是球队队长')
      }
      this.$router.push('/team/MessageCenter')
    },

    deleteJoinTeam (newCaptain) {
      this.$socket.emit('deleteJoinTeam', newCaptain)
    },

    toIndex () { this.$router.replace('/home') },

    selectCaptain (selectCaptain) {
      const newCaptainObj = this.teamMemberList.filter(item => item.username === selectCaptain)
      console.log(newCaptainObj)
      const data = {
        teamID: this.$store.state.team.teamInfo.id,
        newCaptain: newCaptainObj[0]
      }
      this.$API.team.teamQuit(data)
        .then(resQuit => {
          console.log(resQuit.data)
          sessionStorage.setItem('teamInfo', JSON.stringify(''))
          this.getTeamInfo()
          this.$router.go(0)
        }).catch(errQuit => {
          console.log('errQuit' + errQuit)
        })
    },

    QuitTeam () {
      if (this.$store.state.team.teamInfo.joinStatus === 1) {
        return alert('球队申请中，请选择撤销申请')
      }
      if (!this.$store.state.team.teamInfo.teamName) {
        return alert('你还未加入任何球队')
      }

      if (confirm('你是否要退出球队：' + this.$store.state.team.teamInfo.teamName)) {
        // 队员退出球队
        if (this.$store.state.user.userinfo.id !== this.$store.state.team.teamInfo.CaptainID) {
          this.el_popoverDisable = true
          const data = {
            teamID: this.$store.state.team.teamInfo.id,
            newCaptain: ''
          }
          this.$API.team.teamQuit(data)
            .then(resQuit => {
              console.log(resQuit.data)
              sessionStorage.setItem('teamInfo', JSON.stringify(''))
              this.getTeamInfo()
              this.$router.go(0)
              // this.reload()
            }).catch(errQuit => {
              console.log('errQuit' + errQuit)
            })
          return false
        }
        // .......................
        // 只有队长一人,退出球队
        if (this.$store.state.user.userinfo.id === this.$store.state.team.teamInfo.CaptainID && this.teamMemberList.length === 0) {
          if (confirm('此操作是要删除球队：' + this.$store.state.team.teamInfo.teamName)) {
            const data = {
              teamID: this.$store.state.team.teamInfo.id,
              deleteTime: new Date().toJSON()
            }
            this.$API.team.teamDelete(data).then(resDelete => {
              console.log(resDelete.data)
              sessionStorage.setItem('teamInfo', JSON.stringify(''))
              this.getTeamInfo()
              this.$router.go(0)
              // this.reload()
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
      if (!this.$store.state.team.teamInfo.joinStatus) {
        alert('你没有申请球队,请勿乱按')
        return false
      }

      const updateTime = new Date().toJSON()
      const newCaptain = this.$store.state.team.teamInfo.newCaptain
      this.$API.team.deleteTeamJoin(updateTime).then(res => {
        console.log(res.data)
        if (res.data.status === 200) {
          this.$socket.close()
          this.$socket.open()
          this.$socket.emit('connectServer', {
            username: this.$store.state.user.userinfo.username,
            userID: this.$store.state.user.userinfo.id
          })
          // this.$socket.emit('deleteJoinTeam', this.$store.state.team.teamInfo.newCaptain)
          console.log(newCaptain)
          this.deleteJoinTeam(newCaptain)
          sessionStorage.setItem('teamInfo', JSON.stringify(''))
          this.getTeamInfo()
          // this.$router.go(0)
          this.$router.replace('/user')
        }
      }).catch(err => {
        console.log(err)
      })
      // this.reload()
    },

    toActivity () {
      this.$router.push('/activity/list')
    },

    joinTeam () {
      if (this.$store.state.team.teamInfo.teamName) {
        return alert('已加入球队，不能再申请加入其他球队')
      }
      this.$router.push('/teamList')
    },

    createTeam () {
      if (this.$store.state.team.teamInfo.teamName) {
        return alert('球队名不为空,已加入球队')
      }
      this.$router.push('/team/create')
    },

    setTeamInfo () {
      if (!this.$store.state.team.teamInfo.teamName) {
        return alert('你还未加入任何球队')
      }
      if (this.$store.state.user.userinfo.id !== this.$store.state.team.teamInfo.CaptainID) {
        return alert('你不是球队队长，不能修改球队资料')
      }
      this.$router.push('/team/setTeamInfo')
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

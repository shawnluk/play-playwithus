<template>
  <div>
    <!-- <div class="msgContent" v-for="item in this.contentMsg" :key="item._id">
      <p>{{item.message}}</p>
      <button>是否同意</button>
    </div> -->
      <el-table
      :data="contentMsg"
      stripe
      style="width: 100%">
      <el-table-column
        prop="time"
        label="申请日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="fromUser"
        label="用户姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="message"
        label="申请信息">
      </el-table-column>
          <el-table-column
        fixed="right"
        label="队长操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="success" size="small" :disabled="disabled">同意</el-button>
          <el-button @click="handleClick(scope.row)" type="danger"  size="small" :disabled="disabled">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'UserMessage',
  data () {
    return {
      count: 0,
      contentMsg: [],
      disabled: false
    }
  },

  sockets: {
    getJoinMsg (data) {
      if (data) {
        this.count = data.msg.length
        this.contentMsg = data.msg
        console.log(data)
      }
    },
    getDeleteJoinMsg (message) {
      if (message) {
        console.log(message)
      }
    }
  },

  mounted () {
    this.$socket.close()
    this.$socket.open()
    this.connectServer()
  },
  methods: {
    connectServer () {
      // console.log(this.$store.state.user.userinfo.username) ==> undefined
      if (this.$store.state.user.userinfo.username !== undefined) {
        const userObj = {
          username: this.$store.state.user.userinfo.username,
          userID: this.$store.state.user.userinfo.id
        }
        this.$socket.emit('connectServer', userObj)
      }
      return false
    },
    handleClick (e) {
      // console.log(e.fromUser)
      const userObj = {
        userID: e.fromUserID,
        username: e.fromUser
      }
      this.$API.team.captainAgreeJoin(userObj).then(res => {
        if (res.data.status === 200) {
          this.$socket.close()
          this.$socket.open()
          this.connectServer()
          this.$socket.emit('agreeJoin', { fromUser: e.fromUser, msgID: e._id })
        }
        console.log(res.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>

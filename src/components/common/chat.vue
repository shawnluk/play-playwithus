<template>
  <div class="main">
    <el-row>
      <el-col :span="16">
        <el-input id='input' v-model="input"></el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="sendMsg">Send</el-button>
      </el-col>
    </el-row>
    <div id="content"></div>
  </div>
</template>
<script>
// // import VueSocketIO from 'vue-socket.io'
// import { io } from 'socket.io-client'

const ENTER = 0
const LEAVE = 1

export default {
  name: 'Chat',
  created () {
    this.$socket.open()
    this.login()
  },
  data () {
    return {
      input: '',
      content: '',
      message: '',
      toUser: this.$route.query.toUser
    }
  },

  sockets: {
    connect () {
      this.$message({
        message: '连接成功！！！',
        type: 'success'
      })
    },
    disconnect () {
      this.$message({
        message: '连接断开！！！',
        type: 'error'
      })
    },
    broadcast_msg (data) {
      // console.log(data)
      const content = document.querySelector('#content')
      const div = document.createElement('div')
      div.innerText = `${data.msg} ---${data.time}`
      if (data.type === ENTER) {
        div.style.color = 'green'
      } else if (data.type === LEAVE) {
        div.style.color = 'red'
      } else {
        div.style.color = 'blue'
      }
      content.appendChild(div)
    },
    chatPrivate (data) {
      // console.log(msg)
      const content = document.querySelector('#content')
      const div = document.createElement('div')
      div.innerText = `${data.msg} ---${data.time}`
      if (data.type === ENTER) {
        div.style.color = 'green'
      } else if (data.type === LEAVE) {
        div.style.color = 'red'
      } else {
        div.style.color = 'blue'
      }
      content.appendChild(div)
    }
  },

  methods: {
    sendMsg () {
      // this.$socket.open()
      // if (this.toUser === this.$store.state.user.userinfo.username) {
      const data = {
        msg: this.input,
        toUser: this.toUser
      }
      console.log(data)
      this.$socket.emit('send_msg', data)
      // }
    },
    login () {
      this.$socket.emit('login', this.$store.state.user.userinfo.username)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main {
  width: 500px;
}
#input {
  width: 10px;
}
#content {
  margin-top: 15px;
  text-align: left;
}
</style>

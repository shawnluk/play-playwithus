<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="text-center avatar-box">
        <img src="@/assets/logo.png" class="img-thumbnail avatar" alt="" />
      </div>

      <!-- 表单区域 -->
      <div class="form-login p-4">
        <!-- 登录名称 -->
        <div class="form-group form-inline">
          <label for="username">登录名称</label>
          <input
            type="text"
            class="form-control ml-2"
            id="username"
            placeholder="请输入登录名称"
            autocomplete="off"
            v-model.trim="username"
          />
        </div>
        <!-- 登录密码 -->
        <div class="form-group form-inline">
          <label for="password">登录密码</label>
          <input
            type="password"
            class="form-control ml-2"
            id="password"
            placeholder="请输入登录密码"
            v-model.trim="password"
          />
        </div>
        <!-- 登录和重置按钮 -->
        <div class="form-group form-inline d-flex justify-content-end">
          <button type="button" class="btn btn-secondary mr-2" @click="Reguser">立即注册</button>
          <button type="button" class="btn btn-secondary mr-2" @click="reset">重置</button>
          <button type="button" class="btn btn-primary" @click="login">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// import router from '@/router/index'

export default {
  name: 'MyLogin',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    reset () {
      this.username = ''
      this.password = ''
    },
    login () {
      const url = 'http://127.0.0.1:3030/user/login'
      // console.log(this.username)
      axios.post(url, {
        username: this.username,
        password: this.password
      }).then(res => {
        // console.log(this.username)
        console.log(res.data)
        if (res.data.status === 1) {
          alert(JSON.stringify(res.data))
        }

        if (res.data.status === 0) {
          //   alert('登陆成功')
          localStorage.setItem('token', res.data.token)
          this.$router.replace('/my/userinfo')
          // console.log(this.$router)
          // if (res.data.token) {
          //   localStorage.setItem('token', res.data.token)
          //   this.$router.push('/my/userinfo')
          // } else {
          //   alert('设置token失败')
          // }
        }
      }).catch((err) => {
        console.log(err)
        // console.log('请求错误')
      })
    },
    Reguser () {
      const url = 'http://127.0.0.1:3030/user/reguser'
      axios.post(url, {
        username: this.username,
        password: this.password
      }).then(res => {
        console.log(res.data)
        // this.$router.push('/my/userinfo')
        this.login()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #35495e;
  height: 100%;
  .login-box {
    width: 400px;
    height: 250px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.5);
    .form-login {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      box-sizing: border-box;
    }
  }
}

.form-control {
  flex: 1;
}

.avatar-box {
  position: absolute;
  width: 100%;
  top: -65px;
  left: 0;
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50% !important;
    box-shadow: 0 0 6px #efefef;
  }
}
</style>
